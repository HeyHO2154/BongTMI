import React from "react";
import styled from "styled-components";
import { ShoppingBag, Heart } from "lucide-react";

interface ProductData {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
}

const Shop: React.FC = () => {
  // 임시 상품 데이터
  const products: ProductData[] = [
    {
      id: "1",
      name: "봉사 티셔츠",
      price: 25000,
      imageUrl: "/assets/product1.jpg",
      description: "편안한 착용감의 봉사활동용 티셔츠",
      category: "의류"
    },
    {
      id: "2",
      name: "봉사 모자",
      price: 15000,
      imageUrl: "/assets/product2.jpg",
      description: "자외선 차단 봉사활동용 모자",
      category: "액세서리"
    },
    // ... 더 많은 상품 데이터
  ];

  return (
    <ShopWrapper>
      <Header>
        <Title>봉틈이 스토어</Title>
        <SubTitle>봉사활동에 필요한 모든 것</SubTitle>
      </Header>

      <CategoryList>
        <CategoryItem selected>전체</CategoryItem>
        <CategoryItem>의류</CategoryItem>
        <CategoryItem>액세서리</CategoryItem>
        <CategoryItem>도구</CategoryItem>
      </CategoryList>

      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id}>
            <ProductImage src={product.imageUrl} alt={product.name} />
            <ProductInfo>
              <ProductCategory>{product.category}</ProductCategory>
              <ProductName>{product.name}</ProductName>
              <ProductDescription>{product.description}</ProductDescription>
              <PriceRow>
                <Price>{product.price.toLocaleString()}원</Price>
                <Actions>
                  <ActionButton>
                    <Heart size={20} />
                  </ActionButton>
                  <ActionButton>
                    <ShoppingBag size={20} />
                  </ActionButton>
                </Actions>
              </PriceRow>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>
    </ShopWrapper>
  );
};

export default Shop;

const ShopWrapper = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #333;
  margin-bottom: 8px;
`;

const SubTitle = styled.p`
  font-size: 16px;
  color: #666;
`;

const CategoryList = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
`;

const CategoryItem = styled.button<{ selected?: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  background-color: ${props => props.selected ? 'rgb(231, 174, 100)' : '#f0f0f0'};
  color: ${props => props.selected ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.selected ? 'rgb(231, 174, 100)' : '#e0e0e0'};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 16px;
`;

const ProductCategory = styled.span`
  font-size: 12px;
  color: #666;
  background-color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
`;

const ProductName = styled.h3`
  font-size: 18px;
  margin: 8px 0;
  color: #333;
`;

const ProductDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #666;
  transition: color 0.2s;

  &:hover {
    color: rgb(231, 174, 100);
  }
`;
