import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

export type ChartConfig = {
    [key: string]: {
        type: string;
        data: any[];
        options?: any;
    };
};

type ChartContextProps = {
    config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

export const ChartProvider: React.FC<{ config: ChartConfig, children: React.ReactNode }> = ({ config, children }) => {
    return (
        <ChartContext.Provider value={{ config }}>
            {children}
        </ChartContext.Provider>
    );
};

export const useChart = () => {
    const context = React.useContext(ChartContext);
    if (!context) {
        throw new Error('useChart must be used within a ChartProvider');
    }
    return context;
};

export const Chart: React.FC<{ id: string }> = ({ id }) => {
    const { config } = useChart();
    const chartConfig = config[id];

    if (!chartConfig) {
        return <div>Chart config not found</div>;
    }

    const { type, data, options } = chartConfig;

    switch (type) {
        case 'line':
            return (
                <RechartsPrimitive.LineChart data={data} {...options}>
                    {/* Add LineChart components here */}
                </RechartsPrimitive.LineChart>
            );
        // Add more chart types as needed
        default:
            return <div>Unsupported chart type</div>;
    }
};