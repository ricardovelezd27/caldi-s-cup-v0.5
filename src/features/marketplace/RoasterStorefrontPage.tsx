import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/layout";
import { Container } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useRoasterStorefront } from "./hooks/useRoasterStorefront";
import { 
  RoasterHero, 
  RoasterAbout, 
  RoasterContact, 
  RoasterSidebarCard,
  FeaturedProductsSection, 
  RoasterProductCatalog 
} from "./components";

const RoasterStorefrontPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useRoasterStorefront(id || "");

  // Loading state (for future API integration)
  if (isLoading) {
    return (
      <PageLayout>
        <Container size="wide" className="py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-40 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </Container>
      </PageLayout>
    );
  }

  // Error/Not Found state
  if (error || !data) {
    return (
      <PageLayout>
        <Container className="py-8">
          <div className="text-center py-16">
            <h1 className="font-bangers text-3xl text-foreground mb-4">
              Roaster Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the roaster you're looking for.
            </p>
            <Button asChild>
              <Link to="/marketplace">Browse Marketplace</Link>
            </Button>
          </div>
        </Container>
      </PageLayout>
    );
  }

  const { roaster, featuredProducts, allProducts, productCount } = data;

  return (
    <PageLayout>
      <Container size="wide" className="py-6 sm:py-8">
        {/* Breadcrumb */}
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>

        {/* Hero */}
        <RoasterHero roaster={roaster} productCount={productCount} />

        {/* Tabs */}
        <Tabs defaultValue="products" className="mt-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md border-4 border-border">
            <TabsTrigger 
              value="products" 
              className="font-medium data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
            >
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="about" 
              className="font-medium data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
            >
              About
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="font-medium data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
            >
              Contact
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sidebar - Desktop */}
              <aside className="hidden lg:block lg:col-span-3 space-y-6">
                <RoasterSidebarCard roaster={roaster} />
                {featuredProducts.length > 0 && (
                  <FeaturedProductsSection products={featuredProducts} />
                )}
              </aside>

              {/* Main Content */}
              <div className="lg:col-span-9">
                {/* Mobile Featured */}
                {featuredProducts.length > 0 && (
                  <div className="lg:hidden mb-6">
                    <FeaturedProductsSection products={featuredProducts} />
                  </div>
                )}
                
                <RoasterProductCatalog 
                  products={allProducts} 
                  roasterName={roaster.name} 
                />
              </div>
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="mt-6">
            <div className="max-w-2xl">
              <RoasterAbout roaster={roaster} />
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="mt-6">
            <div className="max-w-md">
              <RoasterContact roaster={roaster} />
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </PageLayout>
  );
};

export default RoasterStorefrontPage;
