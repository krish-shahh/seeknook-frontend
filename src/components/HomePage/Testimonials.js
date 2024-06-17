import React from 'react';
import { Carousel, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const testimonials = [
    { quote: "SeekNook has transformed the way I connect with my peers.", author: "John Doe" },
    { quote: "An invaluable tool for collaboration and resource sharing.", author: "Jane Smith" },
    { quote: "The best platform for professional networking.", author: "Sam Johnson" }
];

const Testimonials = () => (
    <div className="testimonials-section">
        <Title level={2} style={{ textAlign: 'center' }}>Testimonials</Title>
        <Carousel autoplay>
            {testimonials.map((testimonial, index) => (
                <div key={index}>
                    <Paragraph style={{ textAlign: 'center' }}>"{testimonial.quote}"</Paragraph>
                    <Paragraph style={{ textAlign: 'center' }}>- {testimonial.author}</Paragraph>
                </div>
            ))}
        </Carousel>
    </div>
);

export default Testimonials;
