# 投资策略分析 API 规范文档

## API 基础信息
- 基础路径: `/api/v1`
- 响应格式: JSON
- 认证方式: Bearer Token

## 接口列表

### 1. 市场数据接口

#### 1.1 获取市场基础信息
```http
GET /markets
```
返回所有支持的市场列表及其基本信息。

**响应示例:**
```json
{
  "markets": [
    {
      "id": "hs300",
      "name": "沪深300",
      "fullName": "国内 - 沪深300",
      "type": "index",
      "region": "CN",
      "description": "中国大陆大型蓝筹股指数",
      "tradingHours": "09:30-15:00",
      "timezone": "Asia/Shanghai"
    }
  ]
}
```

#### 1.2 获取市场历史数据
```http
GET /markets/{marketId}/history
```
获取指定市场的历史价格和交易数据。

**参数:**
- `startDate`: YYYY-MM（必填）
- `endDate`: YYYY-MM（必填）
- `interval`: 'daily' | 'weekly' | 'monthly'（可选，默认 'monthly'）

**响应示例:**
```json
{
  "marketId": "hs300",
  "interval": "monthly",
  "data": [
    {
      "date": "2023-01",
      "open": 3852.65,
      "high": 4190.62,
      "low": 3802.54,
      "close": 4176.45,
      "volume": 8562145785,
      "amount": 956231456789
    }
  ]
}
```

### 2. 市场趋势分析接口

#### 2.1 获取市场趋势分析
```http
GET /markets/{marketId}/trends
```
获取特定时间段的市场趋势分析。

**参数:**
- `startDate`: YYYY-MM（必填）
- `endDate`: YYYY-MM（必填）

**响应示例:**
```json
{
  "marketId": "hs300",
  "trends": [
    {
      "period": {
        "start": "2023-01",
        "end": "2023-06"
      },
      "type": "bull",
      "confidence": 0.85,
      "change": "+15.3%",
      "description": "经济复苏带动市场走强",
      "keyFactors": [
        {
          "factor": "GDP增速",
          "impact": "positive",
          "value": "5.5%"
        }
      ]
    }
  ],
  "indicators": {
    "macro": {
      "gdpGrowth": {
        "value": "5.2%",
        "trend": "up",
        "lastUpdate": "2023-Q4"
      },
      "pmi": {
        "value": 50.8,
        "trend": "neutral",
        "lastUpdate": "2023-12"
      }
    },
    "technical": {
      "macd": {
        "value": "positive",
        "signal": "buy",
        "strength": 0.75
      }
    },
    "sentiment": {
      "marketSentiment": {
        "value": "bullish",
        "score": 0.72
      }
    }
  }
}
```

### 3. 定投策略接口

#### 3.1 计算定投策略结果
```http
POST /investment/calculate
```
计算不同定投策略的模拟结果。

**请求体:**
```json
{
  "marketId": "hs300",
  "startDate": "2023-01",
  "endDate": "2023-12",
  "monthlyAmount": 1000,
  "strategy": {
    "type": "enhanced",
    "params": {
      "bearThreshold": -0.04,
      "bullThreshold": 0.04,
      "bearMultiplier": 1.5,
      "bullMultiplier": 0.7
    }
  }
}
```

**响应示例:**
```json
{
  "summary": {
    "totalInvestment": 12000,
    "finalValue": 13560,
    "totalReturn": "13.0%",
    "annualizedReturn": "12.5%",
    "maxDrawdown": "-8.5%",
    "sharpeRatio": 1.25
  },
  "monthly": [
    {
      "date": "2023-01",
      "investment": 1000,
      "shares": 2.5,
      "value": 1025,
      "return": "2.5%"
    }
  ],
  "performance": {
    "valueHistory": [...],
    "benchmarkComparison": {...},
    "riskMetrics": {...}
  }
}
```

#### 3.2 获取策略回测结果
```http
POST /investment/backtest
```
执行策略回测并返回详细分析。

**请求体:**
```json
{
  "marketId": "hs300",
  "startDate": "2020-01",
  "endDate": "2023-12",
  "strategies": [
    {
      "type": "normal",
      "monthlyAmount": 1000
    },
    {
      "type": "enhanced",
      "monthlyAmount": 1000,
      "params": {
        "bearThreshold": -0.04,
        "bullThreshold": 0.04,
        "bearMultiplier": 1.5,
        "bullMultiplier": 0.7
      }
    }
  ]
}
```

**响应示例:**
```json
{
  "summary": {
    "period": {
      "months": 48,
      "startDate": "2020-01",
      "endDate": "2023-12"
    },
    "marketReturn": "45.2%",
    "strategies": {
      "normal": {
        "totalInvestment": 48000,
        "finalValue": 62400,
        "totalReturn": "30.0%",
        "annualizedReturn": "9.8%",
        "maxDrawdown": "-15.3%",
        "sharpeRatio": 0.95
      },
      "enhanced": {
        "totalInvestment": 52000,
        "finalValue": 72800,
        "totalReturn": "40.0%",
        "annualizedReturn": "12.5%",
        "maxDrawdown": "-12.1%",
        "sharpeRatio": 1.15
      }
    }
  },
  "monthlyDetails": [...],
  "analysis": {
    "riskAdjustedReturns": {...},
    "marketConditionPerformance": {...},
    "statisticalMetrics": {...}
  }
}
```

## 错误响应
所有接口的错误响应格式统一：

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述信息",
    "details": {}
  }
}
```

常见错误代码：
- `INVALID_DATES`: 日期范围无效
- `MARKET_NOT_FOUND`: 市场不存在
- `INVALID_PARAMS`: 参数错误
- `DATA_NOT_AVAILABLE`: 数据不可用