import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@/components/ui/card";

const MetricsDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalTokensInput: 0,
    totalTokensOutput: 0,
    apiCalls: 0,
    costWithAbstract: 0,
    costWithoutAbstract: 0,
    moneySaved: 0,
    modelUsage: {},
  });

  useEffect(() => {
    // Fetch metrics data from your API
    const fetchMetrics = async () => {
      // Replace this with your actual API call
      const response = await fetch("/api/metrics");
      const data = await response.json();
      setMetrics(data);
    };

    fetchMetrics();
    // Set up an interval to fetch metrics periodically
    const interval = setInterval(fetchMetrics, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const modelUsageData = Object.entries(metrics.modelUsage).map(
    ([model, count]) => ({
      name: model,
      count: count,
    })
  );

  return (
    <div className="p-4">
      <Typography variant="h4" className="mb-4">
        Metrics Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardHeader>
              <Typography variant="h6">API Usage</Typography>
            </CardHeader>
            <CardContent>
              <Typography variant="h4">{metrics.apiCalls}</Typography>
              <Typography variant="body2">Total API Calls</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardHeader>
              <Typography variant="h6">Tokens</Typography>
            </CardHeader>
            <CardContent>
              <Typography variant="h4">
                {metrics.totalTokensInput + metrics.totalTokensOutput}
              </Typography>
              <Typography variant="body2">
                Total Tokens (In: {metrics.totalTokensInput}, Out:{" "}
                {metrics.totalTokensOutput})
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardHeader>
              <Typography variant="h6">Cost Savings</Typography>
            </CardHeader>
            <CardContent>
              <Typography variant="h4">
                ${metrics.moneySaved.toFixed(2)}
              </Typography>
              <Typography variant="body2">Total Money Saved</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardHeader>
              <Typography variant="h6">Cost Comparison</Typography>
            </CardHeader>
            <CardContent>
              <Typography variant="body2">
                With Abstract: ${metrics.costWithAbstract.toFixed(2)}
              </Typography>
              <Typography variant="body2">
                Without Abstract: ${metrics.costWithoutAbstract.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader>
              <Typography variant="h6">Model Usage</Typography>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modelUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader>
              <Typography variant="h6">Model Usage Breakdown</Typography>
            </CardHeader>
            <CardContent>
              <List>
                {Object.entries(metrics.modelUsage).map(([model, count]) => (
                  <ListItem key={model}>
                    <ListItemText
                      primary={model}
                      secondary={`${count} calls (${(
                        (count / metrics.apiCalls) *
                        100
                      ).toFixed(2)}%)`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default MetricsDashboard;
