'use client'
import MetaMaskCard from '@/app/components/connectorCards/MetaMaskCard';
import { Button, Card, CardContent, Typography, Grid } from '@mui/material';
import { hooks } from '@/app/connections/metaMask';
import { ethers } from 'ethers';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { CourseMarket__factory, YiDengToken__factory } from '@/app/abi/typechain-types';
import NFTGallery from '@/app/components/NFTGallery';

interface Course {
  web2CourseId: string;
  name: string;
  price: bigint;
  isActive: boolean;
  creator: string;
}

const HomePage = () => {
  const { useProvider, useIsActivating, useAccounts } = hooks;
  const provider = useProvider();
  const isActive = true;
  const account = useAccounts();
  const signer = provider?.getSigner();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [userCourses, setUserCourses] = useState<Record<string, boolean>>({});
  const [tokenBalance, setTokenBalance] = useState<string>('0');

  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "";
  const marketAddress = process.env.NEXT_PUBLIC_MARKET_ADDRESS || "";

  useEffect(() => {
    if (!tokenAddress || !marketAddress) {
      console.error("合约地址未配置");
      return;
    }
    console.log("使用的合约地址:", {
      token: tokenAddress,
      market: marketAddress
    });
  }, [tokenAddress, marketAddress]);

  const contracts = useMemo(() => {
    if (!signer) return null;
    return {
      token: YiDengToken__factory.connect(tokenAddress, signer),
      market: CourseMarket__factory.connect(marketAddress, signer)
    };
  }, [signer]);

  useEffect(() => {
    const loadCourses = async () => {
      if (!contracts?.market) {
        console.log("Market合约未初始化，跳过加载");
        return;
      }
      
      try {
        setLoading(true);
        console.log("正在获取课程总数...");
        const courseCount = await contracts.market.courseCount();
        console.log("课程总数:", courseCount.toString());

        const courseList: Course[] = [];
        
        for (let i = 1; i <= Number(courseCount); i++) {
          console.log(`正在获取第 ${i} 个课程...`);
          try {
            const course = await contracts.market.courses(i);
            console.log(`课程 ${i} 信息:`, {
              id: course.web2CourseId,
              name: course.name,
              price: course.price.toString(),
              isActive: course.isActive,
              creator: course.creator
            });
            courseList.push(course);
          } catch (courseError) {
            console.error(`获取课程 ${i} 失败:`, courseError);
          }
        }
        
        console.log("所有课程:", courseList);
        setCourses(courseList);
      } catch (error) {
        console.error("加载课程失败:", error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    if (contracts?.market && !initialized) {
      loadCourses();
    }
  }, [contracts?.market, initialized]);

  const getCourseInfo = async (courseId: number) => {
    console.log("开始查询课程信息...");
    console.log("Market Contract:", contracts?.market);
    
    if (!contracts?.market) {
      console.error("Market 合约未初始化");
      return;
    }

    try {
      console.log(`正在查询课程 ID: ${courseId}`);
      const course = await contracts.market.courses(courseId);
      console.log("课程信息:", {
        id: course.web2CourseId,
        name: course.name,
        price: course.price.toString(),
        isActive: course.isActive,
        creator: course.creator
      });
      return course;
    } catch (error: any) {
      console.error("获取课程信息失败:", {
        error,
        message: error.message,
        code: error.code,
        data: error.data,
        courseId
      });
    }
  };

  const checkUserCourse = async (courseId: string) => {
    if (!contracts?.market || !account?.[0]) return;
    try {
      const hasCourse = await contracts.market.hasCourse(account[0], courseId);
      console.log("是否拥有课程:", hasCourse);
      return hasCourse;
    } catch (error) {
      console.error("查询课程所有权失败:", error);
    }
  };

  const purchaseCourse = async (courseId: string) => {
    if (!contracts?.token || !contracts?.market || !account?.[0]) {
      console.error("合约或账户未初始化");
      return;
    }

    try {
      console.log("开始购买流程...");
      console.log("当前账户:", account[0]);

      // 1. 获取课程信息
      const course = await contracts.market.courses(1);
      console.log("课程信息:", course);

      // 2. 检查代币余额
      const balance = await contracts.token.balanceOf(account[0]);
      console.log("当前代币余额:", balance.toString());
      
      if (balance < course.price) {
        alert("代币余额不足");
        return;
      }

      // 3. 检查授权额度
      const allowance = await contracts.token.allowance(account[0], marketAddress);
      console.log("当前授权额度:", allowance.toString());

      // 4. 如果需要授权
      if (allowance < course.price) {
        console.log("开始授权...");
        try {
          const approveTx = await contracts.token.approve(
            marketAddress, 
            course.price,
            {
              gasLimit: 100000
            }
          );
          console.log("授权交易已发送, hash:", approveTx.hash);
          
          const approveReceipt = await provider?.waitForTransaction(approveTx.hash);
          console.log("授权交易已确认:", approveReceipt);
          
          if (!approveReceipt || approveReceipt.status === 0) {
            throw new Error("授权失败");
          }
        } catch (approveError) {
          console.error("授权失败:", approveError);
          return;
        }
      }

      // 5. 执行购买
      console.log("开始购买课程...");
      const tx = await contracts.market.purchaseCourse(courseId, {
        gasLimit: 300000
      });
      console.log("购买交易已发送, hash:", tx.hash);
      
      const receipt = await provider?.waitForTransaction(tx.hash);
      console.log("购买交易已确认:", receipt);

      if (receipt?.status === 1) {
        console.log("课程购买成功");
        // 更新用户课程状态
        setUserCourses(prev => ({
          ...prev,
          [courseId]: true
        }));
        // 可以添加成功提示
        alert("课程购买成功！");
      } else {
        throw new Error("购买交易失败");
      }
    } catch (error: any) {
      console.error("购买流程失败:", {
        message: error.message,
        code: error.code,
        data: error.data
      });
      alert("购买失败，请查看控制台了解详情");
    }
  };

  const verifyContracts = async () => {
    if (!provider) {
      console.error("Provider not initialized");
      return;
    }

    try {
      console.log("开始验证合约...");
      
      const tokenCode = await provider.getCode(tokenAddress);
      console.log("Token 合约状态:", {
        address: tokenAddress,
        hasCode: tokenCode !== "0x",
        codeLength: tokenCode.length
      });
      
      const marketCode = await provider.getCode(marketAddress);
      console.log("Market 合约状态:", {
        address: marketAddress,
        hasCode: marketCode !== "0x",
        codeLength: marketCode.length
      });

      if (contracts?.token && contracts?.market) {
        const name = await contracts.token.name();
        const symbol = await contracts.token.symbol();
        const totalSupply = await contracts.token.totalSupply();
        console.log("Token 合约函数调用:", {
          name,
          symbol,
          totalSupply: totalSupply.toString()
        });

        const courseCount = await contracts.market.courseCount();
        console.log("Market 合约函数调用:", {
          courseCount: courseCount.toString()
        });

        if (account?.[0]) {
          const balance = await contracts.token.balanceOf(account[0]);
          console.log("当前账户代币余额:", balance.toString());
        }
      }
    } catch (error) {
      console.error("合约验证失败:", error);
    }
  };

  const loadUserCourses = useCallback(async () => {
    if (!contracts?.market || !account?.[0] || !courses.length) {
      return;
    }
    
    try {
      const newUserCourses: Record<string, boolean> = {};
      await Promise.all(
        courses.map(async (course) => {
          const hasCourse = await contracts.market.hasCourse(account[0]!, course.web2CourseId);
          newUserCourses[course.web2CourseId] = hasCourse;
        })
      );
      setUserCourses(newUserCourses);
    } catch (error) {
      console.error("加载用户课程状态失败:", error);
    }
  }, [contracts?.market, account]);

  useEffect(() => {
    const shouldLoad = 
      initialized && 
      courses.length > 0 && 
      account?.[0] && 
      contracts?.market;

    if (shouldLoad) {
      const timer = setTimeout(() => {
        loadUserCourses();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [initialized, courses.length, account, contracts?.market, loadUserCourses]);

  const loadTokenBalance = async () => {
    if (!contracts?.token || !account?.[0]) return;
    try {
      const balance = await contracts.token.balanceOf(account[0]);
      setTokenBalance(balance.toString());
    } catch (error) {
      console.error("加载代币余额失败:", error);
    }
  };

  useEffect(() => {
    if (account) {
      loadTokenBalance();
    }
  }, [account, contracts?.token]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">课程市场</h1>
      <MetaMaskCard />
      
      <div className="my-4">
        <Button 
          variant="contained" 
          color="secondary"
          onClick={verifyContracts}
          sx={{ mb: 2 }}
        >
          验证合约
        </Button>
      </div>

      <div className="my-8">
        <NFTGallery 
          provider={provider} 
          signer={signer} 
          account={account?.[0]}
        />
      </div>

      <div className="my-8">
        <Typography variant="h5" gutterBottom>
          可用课程
        </Typography>
        {!provider ? (
          <Typography>请先连接钱包</Typography>
        ) : loading ? (
          <Typography>加载中...</Typography>
        ) : courses.length === 0 && initialized ? (
          <Typography>暂无课程</Typography>
        ) : courses.length > 0 ? (
          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.web2CourseId}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {course.name}
                    </Typography>
                    <Typography color="textSecondary">
                      程ID: {course.web2CourseId}
                    </Typography>
                    <Typography>
                      价格: {course.price.toString()} YD
                    </Typography>
                    <Typography>
                      状态: {course.isActive ? '可购买' : '已下架'}
                    </Typography>
                    {userCourses[course.web2CourseId] ? (
                      <Button 
                        variant="contained" 
                        color="success"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled
                      >
                        已购买
                      </Button>
                    ) : (
                      <Button 
                        variant="contained" 
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => purchaseCourse(course.web2CourseId)}
                        disabled={!course.isActive}
                      >
                        购买课程
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : null}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <Button variant="contained" onClick={async () => {
          if (contracts?.token && account?.[0]) {
            const balance = await contracts.token.balanceOf(account[0]);
            console.log("代币余额:", balance.toString());
          }
        }}>
          查看代币余额
        </Button>

        <Button variant="contained" onClick={() => getCourseInfo(1)}>
          查看课程信息
        </Button>

        <Button variant="contained" onClick={() => checkUserCourse("COURSE-001")}>
          检查课程所有权
        </Button>
      </div>

      <Typography variant="subtitle1" gutterBottom>
        YD Token 余额: {tokenBalance}
      </Typography>
    </div>
  );
};

export default HomePage;
