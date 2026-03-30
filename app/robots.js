export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kiddyshop.pk';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/checkout', '/account', '/orders'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
