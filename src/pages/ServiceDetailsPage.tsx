import { useState } from 'react';
import { Alert, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Service } from '../types/service';
import { getImageSource, getVideoSource } from '../utils/media';

interface ServiceDetailsPageProps {
  services: Service[];
  loading: boolean;
}

export function ServiceDetailsPage({ services, loading }: ServiceDetailsPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [videoFailed, setVideoFailed] = useState(false);
  const service = services.find((item) => item.id === Number(id));

  if (loading) return <div className="state-screen">Загружаем услугу…</div>;
  if (!service) {
    return <Alert variant="secondary"><h2 className="h5">Услуга не найдена</h2><p>Выберите запись из ленты или плитки.</p><Button as={Link} to="/tile" variant="dark">К списку</Button></Alert>;
  }

  const imageSource = getImageSource(service.image_url);
  const videoSource = getVideoSource(service.video_url);

  return (
    <article className="details-page">
      <Button variant="link" className="back-link" onClick={() => navigate(-1)}>← Назад</Button>
      <div className="eyebrow">ПОДРОБНОСТИ УСЛУГИ</div>
      <h1>{service.growth_factor_name}</h1>
      <div className="details-media">
        {videoFailed ? (
          <img src={imageSource} alt={service.growth_factor_name} className="details-media__fallback" />
        ) : (
          <video
            key={service.id}
            className="details-media__video"
            controls
            autoPlay
            muted
            loop
            playsInline
            poster={imageSource}
            onError={() => setVideoFailed(true)}
          >
            <source src={videoSource} type="video/mp4" />
          </video>
        )}
        <Badge bg="light" text="dark" className="details-media__badge">{service.category ?? 'Общее'}</Badge>
      </div>
      <div className="details-metrics">
        <div><span>КОЭФФИЦИЕНТ РОСТА</span><strong>×{service.growth_coefficient?.toFixed(2) ?? '—'}</strong></div>
        <div><span>ВЛИЯНИЕ НА ХРАНЕНИЕ</span><strong>×{service.storage_impact_coefficient?.toFixed(2) ?? '—'}</strong></div>
        <div><span>ЛАЙКИ</span><strong>♡ {service.likes_count}</strong></div>
      </div>
      <section className="details-description">
        <div className="eyebrow">ОПИСАНИЕ</div>
        <p>{service.growth_factor_description || 'Описание для этой услуги пока не добавлено.'}</p>
      </section>
      <div className="details-date">Создано: {new Date(service.created_at).toLocaleString('ru-RU')}</div>
      <Button variant="light" className="btn-sand w-100 mt-3" onClick={() => navigate('/tile')}>Вернуться к плитке</Button>
    </article>
  );
}
