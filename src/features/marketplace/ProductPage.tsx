import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/layout";
import { Container } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  ProductImage,
  ProductInfo,
  AttributeSlider,
  FlavorRadarChart,
  RoasterInfoCard,
  ProductActions,
  ProductAccordions
} from "./components";
import { getProductById, getRoasterByProductId } from "./data/mockProducts";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const roaster = getRoasterByProductId(id || "");

  if (!product) {
    return (
      <PageLayout>
        <Container className="py-16 text-center">
          <h1 className="font-bangers text-4xl text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The coffee you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Container className="py-8">
        {/* Breadcrumb / Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image, Attributes, Flavor Chart, Roaster */}
          <div className="lg:col-span-5 space-y-6">
            {/* Product Image */}
            <ProductImage 
              src={product.imageUrl} 
              alt={product.name} 
            />

            {/* Attribute Sliders */}
            {product.attributeScores && (
              <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card space-y-4">
                <h3 className="font-bangers text-lg text-foreground tracking-wide">
                  Coffee Attributes
                </h3>
                <AttributeSlider
                  label="Body"
                  value={product.attributeScores.body}
                  leftLabel="Light"
                  rightLabel="Full"
                />
                <AttributeSlider
                  label="Acidity"
                  value={product.attributeScores.acidity}
                  leftLabel="Subtle"
                  rightLabel="Bright"
                />
                <AttributeSlider
                  label="Sweetness"
                  value={product.attributeScores.sweetness}
                  leftLabel="Dry"
                  rightLabel="Sweet"
                />
              </div>
            )}

            {/* Flavor Radar Chart */}
            <div className="border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card">
              <FlavorRadarChart notes={product.flavorProfile.notes} />
            </div>

            {/* Roaster Info - Desktop */}
            {roaster && (
              <div className="hidden lg:block">
                <RoasterInfoCard roaster={roaster} />
              </div>
            )}
          </div>

          {/* Right Column: Product Info, Actions, Accordions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Product Info */}
            <ProductInfo product={product} />

            {/* Product Actions (Cart) */}
            <ProductActions product={product} />

            {/* Accordions */}
            <ProductAccordions product={product} />

            {/* Roaster Info - Mobile */}
            {roaster && (
              <div className="lg:hidden">
                <RoasterInfoCard roaster={roaster} />
              </div>
            )}
          </div>
        </div>
      </Container>
    </PageLayout>
  );
};

export default ProductPage;
