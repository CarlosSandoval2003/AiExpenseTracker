import React, { useEffect, useState } from 'react'
import { prepareExpensebarChartData } from '../../utils/helper';
import CustomBarChart from '../Charts/CustomBarChart';

const Last30DaysExpenses = ({data}) => {

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareExpensebarChartData(data);
        setChartData(result);

        return () => {};
    }, [data]);

  return (
    <div className="card col-span-1">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 30 Days Expenses</h5>
      </div>

      <CustomBarChart data={chartData} xDataKey="category" />
    </div>
  )
}

export default Last30DaysExpenses
