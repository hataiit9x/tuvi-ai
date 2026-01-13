/**
 * Frontend Integration Example
 * Cách hiển thị cache status trong UI
 */

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export function TuviAnalysisForm() {
    const [isCached, setIsCached] = useState(false);
    const [analysisTime, setAnalysisTime] = useState(0);

    const analyzeMutation = trpc.tuvi.analyze.useMutation({
        onSuccess: (data) => {
            setIsCached(data.cached);

            // Show different messages based on cache status
            if (data.cached) {
                toast.success('Đã tải kết quả từ cache! ⚡', {
                    description: `Hoàn thành trong ${analysisTime}ms`
                });
            } else {
                toast.success('Phân tích hoàn tất! 🎯', {
                    description: `Đã lưu vào cache cho lần sau`
                });
            }
        }
    });

    const handleSubmit = async (formData) => {
        const startTime = performance.now();

        try {
            const result = await analyzeMutation.mutateAsync(formData);
            const endTime = performance.now();
            setAnalysisTime(Math.round(endTime - startTime));

            return result;
        } catch (error) {
            toast.error('Có lỗi xảy ra', {
                description: error.message
            });
        }
    };

    return (
        <div>
            {/* Your form here */}

            {/* Cache indicator */}
            {isCached && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-sm font-medium text-green-800">
                            Kết quả từ cache - Siêu nhanh! ({analysisTime}ms)
                        </span>
                    </div>
                </div>
            )}

            {/* Loading indicator with different message */}
            {analyzeMutation.isLoading && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-blue-800">
                            {isCached
                                ? 'Đang tải kết quả...'
                                : 'Đang phân tích với AI... (có thể mất 5-10 giây)'
                            }
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * Admin Cache Stats Component
 */
export function AdminCacheStats() {
    const { data: stats, isLoading } = trpc.admin.getCacheStats.useQuery();
    const clearCacheMutation = trpc.admin.clearCache.useMutation({
        onSuccess: () => {
            toast.success('Cache đã được xóa thành công!');
            // Refresh stats
            window.location.reload();
        }
    });

    if (isLoading) return <div>Đang tải...</div>;

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Tổng số cache</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {stats?.totalEntries || 0}
                    </p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Số năm khác nhau</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {Object.keys(stats?.byYear || {}).length}
                    </p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Năm phổ biến nhất</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {stats?.byYear && Object.entries(stats.byYear)
                            .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'}
                    </p>
                </div>
            </div>

            {/* Cache by Year Chart */}
            <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Cache theo năm</h3>
                <div className="space-y-2">
                    {stats?.byYear && Object.entries(stats.byYear)
                        .sort(([a], [b]) => parseInt(b) - parseInt(a))
                        .map(([year, count]) => (
                            <div key={year} className="flex items-center gap-4">
                                <span className="w-16 text-sm font-medium">{year}</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-6">
                                    <div
                                        className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                                        style={{ width: `${(count / stats.totalEntries) * 100}%` }}
                                    >
                                        <span className="text-xs text-white font-medium">{count}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Recent Entries */}
            <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Entries gần đây</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Ngày sinh</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Giờ</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Giới tính</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Năm</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Thời gian tạo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {stats?.recentEntries?.map((entry, idx) => (
                                <tr key={idx}>
                                    <td className="px-4 py-2 text-sm">{entry.birthDate}</td>
                                    <td className="px-4 py-2 text-sm">{entry.birthHour}</td>
                                    <td className="px-4 py-2 text-sm">{entry.gender === 'male' ? 'Nam' : 'Nữ'}</td>
                                    <td className="px-4 py-2 text-sm">{entry.year}</td>
                                    <td className="px-4 py-2 text-sm">
                                        {new Date(entry.createdAt).toLocaleString('vi-VN')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Clear Cache Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => {
                        if (confirm('Bạn có chắc muốn xóa toàn bộ cache?')) {
                            clearCacheMutation.mutate();
                        }
                    }}
                    disabled={clearCacheMutation.isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                    {clearCacheMutation.isLoading ? 'Đang xóa...' : 'Xóa toàn bộ cache'}
                </button>
            </div>
        </div>
    );
}
