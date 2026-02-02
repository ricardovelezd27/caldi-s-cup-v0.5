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
  ProductAccordions,
  ProductDescription
} from "./components";
import { getProductById, getRoasterById } from "./data/mockProducts";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const roaster = product ? getRoasterById(product.roasterId) : undefined;

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
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Product Image - order-1 on all */}
            <div className="order-1">
              <ProductImage 
                src={product.imageUrl} 
                alt={product.name} 
              />
            </div>

            {/* Product Info - Mobile/Tablet only, order-2 */}
            <div className="order-2 lg:hidden">
              <ProductInfo product={product} />
            </div>

            {/* Product Description - Mobile/Tablet only, order-3 */}
            <div className="order-3 lg:hidden">
              <ProductDescription product={product} />
            </div>

            {/* Attribute Sliders - order-4 mobile, order-2 desktop */}
            {product.attributeScores && (
              <div className="order-4 lg:order-2 border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card space-y-4">
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

            {/* Flavor Radar Chart - order-5 mobile, order-3 desktop */}
            <div className="order-5 lg:order-3 border-4 border-border rounded-lg p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card">
              <FlavorRadarChart notes={product.flavorProfile.notes} />
            </div>

            {/* Product Actions - Mobile/Tablet only, order-6 */}
            <div className="order-6 lg:hidden">
              <ProductActions product={product} />
            </div>

            {/* Accordions - Mobile/Tablet only (no description), order-7 */}
            {/* NOTE: px-4 padding matches other card components for consistent spacing */}
            <div className="order-7 lg:hidden border-4 border-border rounded-lg px-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card overflow-hidden">
              <ProductAccordions product={product} hideDescription />
            </div>

            {/* Roaster Info - Mobile/Tablet, order-8 */}
            {roaster && (
              <div className="order-8 lg:hidden">
                <RoasterInfoCard roaster={roaster} />
              </div>
            )}

            {/* Roaster Info - Desktop only, order-4 */}
            {roaster && (
              <div className="hidden lg:block lg:order-4">
                <RoasterInfoCard roaster={roaster} />
              </div>
            )}
          </div>

          {/* Right Column: Product Info, Actions, Accordions - Desktop only */}
          <div className="hidden lg:flex lg:col-span-7 flex-col gap-6">
            {/* Product Info */}
            <ProductInfo product={product} />

            {/* Product Actions (Cart) */}
            <ProductActions product={product} />

            {/* Accordions - with description */}
            {/* NOTE: px-4 padding matches other card components for consistent spacing */}
            <div className="border-4 border-border rounded-lg px-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card overflow-hidden">
              <ProductAccordions product={product} />
            </div>
          </div>
        </div>
      </Container>
    </PageLayout>
  );
};

export default ProductPage;
