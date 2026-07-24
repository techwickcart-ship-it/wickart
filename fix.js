const fs = require('fs');
let code = fs.readFileSync('src/pages/storefront/ProductCard.tsx', 'utf8');
code = code.replace(/export const ProductCard: React\.FC<ProductCardProps> = \(\{[\s\S]*?\}\) \{/, `export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate, onAddToCart, onWishlist, onCompare, onQuickView }) => {`);
fs.writeFileSync('src/pages/storefront/ProductCard.tsx', code);
