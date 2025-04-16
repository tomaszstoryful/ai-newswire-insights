
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-display font-bold mb-4">404</h1>
        <p className="text-xl text-newswire-mediumGray mb-8">
          We couldn't find the page you're looking for.
        </p>
        <div className="flex justify-center">
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
