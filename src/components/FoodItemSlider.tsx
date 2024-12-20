'use client';

import { useRef, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { CaretLeft, CaretLeftFill, CaretRight, CaretRightFill } from 'react-bootstrap-icons';
import FoodItem from './FoodItem';
import './foodItemSlider.css';

export type FoodItemType = {
  name: string;
  image: string;
  label: string[];
};

const FoodItemSlider = ({
  foodItem,
  userFavoriteItems,
  onToggle,
}: {
  foodItem: FoodItemType[];
  userFavoriteItems: string[];
  onToggle: (item: string) => void;
}) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [isLeftHovered, setIsLeftHovered] = useState(false);
  const [isRightHovered, setIsRightHovered] = useState(false);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -600, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 600, behavior: 'smooth' });
    }
  };

  return (
    <Container className="position-relative">
      <Row>
        <Col ref={sliderRef} className="d-flex card-container container overflow-scroll p-4">
          {foodItem.map((itemCard) => (
            <FoodItem
              key={itemCard.name}
              name={itemCard.name}
              picture={itemCard.image}
              label={itemCard.label}
              userFavoriteItems={userFavoriteItems}
              onToggle={onToggle}
            />
          ))}
        </Col>
        <Button
          className="arrow-btn"
          style={{ left: 0 }}
          onClick={scrollLeft}
          onMouseEnter={() => setIsLeftHovered(true)}
          onMouseLeave={() => setIsLeftHovered(false)}
        >
          {isLeftHovered ? <CaretLeftFill /> : <CaretLeft />}
        </Button>
        <Button
          className="arrow-btn"
          style={{ right: 0 }}
          onClick={scrollRight}
          onMouseEnter={() => setIsRightHovered(true)}
          onMouseLeave={() => setIsRightHovered(false)}
        >
          {isRightHovered ? <CaretRightFill /> : <CaretRight />}
        </Button>
      </Row>
    </Container>
  );
};

export default FoodItemSlider;
