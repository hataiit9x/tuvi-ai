/**
 * Example: How to integrate TuviAnalysisPanel into your page
 * This shows a complete working example
 */

import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { TuViChart } from '@/components/TuViChart';
import { TuviAnalysisPanel } from '@/components/TuviAnalysisPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function TuviPageExample() {
    const [formInput, setFormInput] = useState({
        fullName: '',
        birthDate: '',
        birthHour: 'ty',
        gender: 'male' as 'male' | 'female',
        calendarType: 'lunar' as 'lunar' | 'solar'
    });

    const [chartData, setChartData] = useState(null);

    // Generate chart mutation
    const generateChartMutation = trpc.tuvi.generateChart.useMutation({
        onSuccess: (data) => {
            setChartData(data.chart);
        }
    });

    // Analyze chart mutation (overview)
    const analyzeMutation = trpc.tuvi.analyze.useMutation();

    const handleGenerateChart = () => {
        generateChartMutation.mutate(formInput);
    };

    const handleAnalyze = () => {
        analyzeMutation.mutate(formInput);
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <h1 className="text-3xl font-bold text-center text-purple-700">
                Lập Lá Số Tử Vi Đẩu Số
            </h1>

            {/* Form Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Thông Tin Sinh</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Your form inputs here */}
                    <Button onClick={handleGenerateChart} disabled={generateChartMutation.isPending}>
                        {generateChartMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Lập Lá Số Tử Vi
                    </Button>
                </CardContent>
            </Card>

            {/* Chart Display */}
            {chartData && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">Lá Số Tử Vi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TuViChart
                                palaces={chartData.palaces}
                                centerInfo={chartData.centerInfo}
                            />
                        </CardContent>
                    </Card>

                    {/* Analyze Button */}
                    {!analyzeMutation.data && (
                        <div className="text-center">
                            <Button
                                onClick={handleAnalyze}
                                disabled={analyzeMutation.isPending}
                                size="lg"
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                {analyzeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Phân Tích Bằng AI
                            </Button>
                        </div>
                    )}

                    {/* Analysis Panel - NEW! */}
                    {analyzeMutation.data && (
                        <TuviAnalysisPanel
                            palaces={chartData.palaces}
                            overviewAnalysis={analyzeMutation.data.analysis}
                            input={formInput}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

/* 
 * What this example shows:
 * 
 * 1. State Management:
 *    - formInput: Stores user input
 *    - chartData: Stores generated chart
 *    - analyzeMutation.data: Stores overview analysis
 * 
 * 2. Flow:
 *    - User fills form → Click "Lập Lá Số" → Chart shows
 *    - User clicks "Phân Tích Bằng AI" → Overview analysis
 *    - TuviAnalysisPanel shows with tabs
 *    - User can switch tabs and analyze individual palaces
 * 
 * 3. Key Points:
 *    - TuviAnalysisPanel only renders after analysis completes
 *    - It receives: palaces, overview, and input
 *    - It manages palace-specific analysis internally
 *    - No need to manage modal state!
 * 
 * 4. Benefits vs Modal:
 *    - ✅ No modal open/close logic
 *    - ✅ No selected palace state
 *    - ✅ Cleaner code
 *    - ✅ Better UX
 */
