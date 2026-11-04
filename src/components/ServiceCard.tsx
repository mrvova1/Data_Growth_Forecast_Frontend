import { Badge, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import type { Service } from '../types/service';
import { getImageSource } from '../utils/media';

export interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const imageSource = getImageSource(service.image_url);

  return (
    <Card
      as={Link}
      to={`/feed/${service.id}`}
      className="service-card h-100 text-decoration-none"
    >
      <div className="service-card__image-wrap">
        <Card.Img
          variant="top"
          src={imageSource}
          alt={service.growth_factor_name}
          className="service-card__image"
          onError={(event) => {
            const image = event.currentTarget;
            if (image.dataset.fallbackApplied === 'true') return;
            image.dataset.fallbackApplied = 'true';
            image.src = getImageSource(null);
          }}
        />
        <Badge bg="light" text="dark" className="service-card__category">
          {service.category ?? 'Общее'}
        </Badge>
      </div>

      <Card.Body className="service-card__body">
        <div className="service-card__meta">
          ♡ {service.likes_count} ·{' '}
          {new Date(service.created_at).toLocaleDateString('ru-RU')}
        </div>
        <Card.Title className="service-card__title">
          {service.growth_factor_name}
        </Card.Title>
        <div className="service-card__metrics">
          <div>
            <span>РОСТ</span>
            <strong>
              ×{service.growth_coefficient?.toFixed(2) ?? '—'}
            </strong>
          </div>
          <div>
            <span>ВЛИЯНИЕ</span>
            <strong>
              ×{service.storage_impact_coefficient?.toFixed(2) ?? '—'}
            </strong>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
