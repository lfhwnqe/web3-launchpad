'use client'
import MetaMaskCard from '@/app/components/connectorCards/MetaMaskCard';
import { Button, Card, CardContent, Typography, Grid } from '@mui/material';
import { hooks } from '@/app/connections/metaMask';
import { ethers } from 'ethers';
import { useEffect, useState, useMemo } from 'react';
import { CourseMarket__factory, YiDengToken__factory } from '@/app/abi/typechain-types';

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

  const tokenAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
  const marketAddress = "0xc6e7df5e7b4f2a278906862b61205850344d4e7d";

  const contracts = useMemo(() => {
    if (!signer) return null;
    return {
      token: YiDengToken__factory.connect(tokenAddress, signer),
      market: CourseMarket__factory.connect(marketAddress, signer)
    };
  }, [signer]);

  useEffect(() => {
    const loadCourses = async () => {
      if (!contracts?.market || initialized) return;
      
      try {
        setLoading(true);
        const courseCount = await contracts.market.courseCount();
        const courseList: Course[] = [];
        
        for (let i = 1; i <= Number(courseCount); i++) {
          const course = await contracts.market.courses(i);
          courseList.push(course);
        }
        
        setCourses(courseList);
        setInitialized(true);
      } catch (error) {
        console.error("加载课程失败:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [contracts?.market, initialized]);

  const getCourseInfo = async (courseId: number) => {
    if (!contracts?.market) return;
    try {
      const course = await contracts.market.courses(courseId);
      console.log("课程信息:", course);
      return course;
    } catch (error) {
      console.error("获取课程信息失败:", error);
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
      console.log("Token合约地址:", tokenAddress);
      console.log("Market合约地址:", marketAddress);

      const balance = await contracts.token.balanceOf(account[0]);
      console.log("当前代币余额:", balance.toString());

      const course = await contracts.market.courses(1);
      console.log("课程信息:", course);

      const allowance = await contracts.token.allowance(account[0], marketAddress);
      console.log("当前授权额度:", allowance.toString());

      if (allowance < course.price) {
        console.log("开始授权...");
        const approveTx = await contracts.token.approve(marketAddress, course.price);
        console.log("授权交易已发送");
        const approveReceipt = await approveTx.wait();
        console.log("授权交易已确认:", approveReceipt.hash);
      }

      console.log("开始购买课程...");
      const tx = await contracts.market.purchaseCourse(courseId);
      console.log("购买交易已发送");
      const receipt = await tx.wait();
      console.log("购买交易已确认:", receipt.hash);

      console.log("课程购买成功");
    } catch (error: any) {
      console.error("购买课程失败:", {
        message: error.message,
        code: error.code,
        data: error.data
      });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">课程市场</h1>
      <MetaMaskCard />
      
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
            {courses.map((course, index) => (
              <Grid item xs={12} sm={6} md={4} key={course.web2CourseId}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {course.name}
                    </Typography>
                    <Typography color="textSecondary">
                      课程ID: {course.web2CourseId}
                    </Typography>
                    <Typography>
                      价格: {course.price.toString()} YD
                    </Typography>
                    <Typography>
                      状态: {course.isActive ? '可购买' : '已下架'}
                    </Typography>
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
    </div>
  );
};

export default HomePage;
