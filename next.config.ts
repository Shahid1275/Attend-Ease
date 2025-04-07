module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://192.168.50.218/laravel-project/attendance-system/public/api/:path*",
      },
    ];
  },
};