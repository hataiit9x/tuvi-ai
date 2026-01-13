import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { Link } from "wouter";
import { Settings, Loader2, CheckCircle, XCircle, Eye, EyeOff, Trash2, RefreshCw, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Admin() {
  const { user, loading: authLoading, refresh } = useAuth();

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Form state
  const [baseUrl, setBaseUrl] = useState("");
  const [model, setModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  // Query current settings
  const { data: currentSettings, isLoading: settingsLoading, refetch } = trpc.admin.getLLMSettings.useQuery(
    undefined,
    { enabled: user?.role === "admin" }
  );

  // Admin login mutation
  const adminLogin = trpc.auth.adminLogin.useMutation({
    onSuccess: async () => {
      toast.success("Đăng nhập thành công!");
      // Force reload để lấy session mới
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    onError: (error: any) => {
      toast.error(error.message || "Đăng nhập thất bại");
    },
  });

  // Mutations
  const updateSettings = trpc.admin.updateLLMSettings.useMutation({
    onSuccess: () => {
      toast.success("Đã lưu cấu hình LLM thành công!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  const testConnection = trpc.admin.testLLMConnection.useMutation({
    onSuccess: (data: any) => {
      if (data.success) {
        toast.success(data.message || "Kết nối thành công!");
      } else {
        toast.error(data.error || "Kết nối thất bại");
      }
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  const deleteSettings = trpc.admin.deleteLLMSettings.useMutation({
    onSuccess: () => {
      toast.success("Đã xóa cấu hình tùy chỉnh. Hệ thống sẽ sử dụng LLM mặc định.");
      setBaseUrl("");
      setModel("");
      setApiKey("");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  // Load current settings into form
  useEffect(() => {
    if (currentSettings) {
      setBaseUrl(currentSettings.baseUrl || "");
      setModel(currentSettings.model || "");
      setApiKey(currentSettings.apiKey || "");
    }
  }, [currentSettings]);

  const handleSave = () => {
    if (!baseUrl || !model || !apiKey) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    updateSettings.mutate({ baseUrl, model, apiKey });
  };

  const handleTest = () => {
    if (!baseUrl || !model || !apiKey) {
      toast.error("Vui lòng điền đầy đủ thông tin trước khi test");
      return;
    }
    testConnection.mutate({ baseUrl, model, apiKey });
  };

  const handleDelete = () => {
    if (confirm("Bạn có chắc muốn xóa cấu hình tùy chỉnh? Hệ thống sẽ sử dụng LLM mặc định.")) {
      deleteSettings.mutate();
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin đăng nhập");
      return;
    }
    adminLogin.mutate({ username: loginUsername, password: loginPassword });
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </Layout>
    );
  }

  // Hiển thị form đăng nhập admin nếu chưa đăng nhập
  if (!user) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Đăng Nhập Admin
                </h1>
                <p className="text-gray-500">
                  Nhập thông tin đăng nhập để truy cập trang quản trị
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border border-gray-100">
                <div>
                  <Label htmlFor="loginUsername" className="form-label">Tên đăng nhập</Label>
                  <Input
                    id="loginUsername"
                    type="text"
                    placeholder="username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="form-input"
                    autoComplete="username"
                  />
                </div>

                <div>
                  <Label htmlFor="loginPassword" className="form-label">Mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="loginPassword"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="form-input pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={adminLogin.isPending}
                >
                  {adminLogin.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Shield className="w-4 h-4 mr-2" />
                  )}
                  Đăng Nhập
                </Button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-4">
                Chỉ dành cho quản trị viên hệ thống
              </p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (user.role !== "admin") {
    return (
      <Layout>
        <section className="py-20">
          <div className="container">
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Không Có Quyền Truy Cập
              </h1>
              <p className="text-gray-500 mb-8">
                Trang này chỉ dành cho quản trị viên. Vui lòng liên hệ admin nếu bạn cần quyền truy cập.
              </p>
              <Link href="/">
                <Button className="btn-secondary">Quay Về Trang Chủ</Button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium mb-6">
              <Settings className="w-4 h-4" />
              Quản trị hệ thống
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cấu Hình LLM
            </h1>
            <p className="text-gray-600">
              Tùy chỉnh kết nối đến OpenAI-compatible API cho các tính năng AI.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Current Status */}
            <div className={`p-6 rounded-2xl border ${currentSettings
              ? "bg-green-50 border-green-200"
              : "bg-blue-50 border-blue-200"
              }`}>
              <div className="flex items-center gap-3">
                {currentSettings ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Settings className="w-6 h-6 text-blue-600" />
                )}
                <div>
                  <h3 className={`font-bold ${currentSettings ? "text-green-900" : "text-blue-900"}`}>
                    {currentSettings ? "Đang sử dụng LLM tùy chỉnh" : "Đang sử dụng LLM mặc định"}
                  </h3>
                  <p className={`text-sm ${currentSettings ? "text-green-700" : "text-blue-700"}`}>
                    {currentSettings
                      ? `Model: ${currentSettings.model} | URL: ${currentSettings.baseUrl}`
                      : "Hệ thống đang sử dụng LLM built-in của Manus"
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Configuration Form */}
            <div className="result-card">
              <div className="result-header mb-6">
                <div className="result-icon bg-gradient-to-br from-slate-100 to-gray-100">
                  <Settings className="w-8 h-8 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Cấu Hình OpenAI-Compatible API</h3>
                  <p className="text-gray-500">Nhập thông tin kết nối đến API tương thích OpenAI</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Base URL */}
                <div>
                  <Label htmlFor="baseUrl" className="form-label">Base URL</Label>
                  <Input
                    id="baseUrl"
                    type="url"
                    placeholder="https://api.openai.com/v1"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    className="form-input"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL gốc của API (không bao gồm /chat/completions)
                  </p>
                </div>

                {/* Model */}
                <div>
                  <Label htmlFor="model" className="form-label">Model</Label>
                  <Input
                    id="model"
                    type="text"
                    placeholder="gpt-4o, gpt-4-turbo, claude-3-opus, ..."
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="form-input"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tên model sử dụng cho phân tích AI
                  </p>
                </div>

                {/* API Key */}
                <div>
                  <Label htmlFor="apiKey" className="form-label">API Key</Label>
                  <div className="relative">
                    <Input
                      id="apiKey"
                      type={showApiKey ? "text" : "password"}
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="form-input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    API key để xác thực với dịch vụ LLM
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <Button
                    onClick={handleTest}
                    variant="outline"
                    className="btn-secondary"
                    disabled={testConnection.isPending || !baseUrl || !model || !apiKey}
                  >
                    {testConnection.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Test Kết Nối
                  </Button>

                  <Button
                    onClick={handleSave}
                    className="btn-primary"
                    disabled={updateSettings.isPending || !baseUrl || !model || !apiKey}
                  >
                    {updateSettings.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Lưu Cấu Hình
                  </Button>

                  {currentSettings && (
                    <Button
                      onClick={handleDelete}
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      disabled={deleteSettings.isPending}
                    >
                      {deleteSettings.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Xóa & Dùng Mặc Định
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-4">Hướng Dẫn Cấu Hình</h4>
              <div className="space-y-3 text-sm text-blue-800">
                <div>
                  <span className="font-semibold">OpenAI:</span>
                  <span className="ml-2">Base URL: <code className="bg-blue-100 px-1 rounded">https://api.openai.com/v1</code></span>
                </div>
                <div>
                  <span className="font-semibold">Azure OpenAI:</span>
                  <span className="ml-2">Base URL: <code className="bg-blue-100 px-1 rounded">https://YOUR_RESOURCE.openai.azure.com/...</code></span>
                </div>
                <div>
                  <span className="font-semibold">Ollama (Local):</span>
                  <span className="ml-2">Base URL: <code className="bg-blue-100 px-1 rounded">http://localhost:11434/v1</code></span>
                </div>
                <div>
                  <span className="font-semibold">LM Studio:</span>
                  <span className="ml-2">Base URL: <code className="bg-blue-100 px-1 rounded">http://localhost:1234/v1</code></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
