import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { TuviChart } from '@/components/TuviChart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const TuviPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    birthHour: '12:00',
    gender: 'male' as 'male' | 'female',
    calendarType: 'solar' as 'lunar' | 'solar'
  });

  const [showChart, setShowChart] = useState(false);

  const generateChart = trpc.tuvi.generateChart.useMutation({
    onSuccess: () => {
      setShowChart(true);
    }
  });

  const analyzeChart = trpc.tuvi.analyze.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateChart.mutate(formData);
  };

  const handleAnalyze = () => {
    analyzeChart.mutate(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-purple-700">
        Lập Lá Số Tử Vi Đẩu Số
      </h1>

      <div className="max-w-2xl mx-auto mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Thông Tin Sinh</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div>
                <Label htmlFor="birthDate">Ngày sinh</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="birthHour">Giờ sinh</Label>
                <Input
                  id="birthHour"
                  type="time"
                  value={formData.birthHour}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthHour: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label>Giới tính</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value: 'male' | 'female') => 
                    setFormData(prev => ({ ...prev, gender: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Loại lịch</Label>
                <Select 
                  value={formData.calendarType} 
                  onValueChange={(value: 'lunar' | 'solar') => 
                    setFormData(prev => ({ ...prev, calendarType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solar">Dương lịch</SelectItem>
                    <SelectItem value="lunar">Âm lịch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={generateChart.isPending}
              >
                {generateChart.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lập Lá Số Tử Vi
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {showChart && generateChart.data && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Lá Số Tử Vi</h2>
            <TuviChart 
              palaces={generateChart.data.chart.palaces}
              centerInfo={generateChart.data.chart.centerInfo}
            />
          </div>

          <div className="text-center">
            <Button 
              onClick={handleAnalyze}
              disabled={analyzeChart.isPending}
              size="lg"
            >
              {analyzeChart.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Phân Tích Bằng AI
            </Button>
          </div>

          {analyzeChart.data && (
            <Card>
              <CardHeader>
                <CardTitle>Phân Tích Tử Vi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans">
                    {analyzeChart.data.analysis}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
