import { useCallback, useState } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { Service } from '../types/service';
import { getImageSource, getVideoSource } from '../utils/media';

interface FeedPageProps {
  services: Service[];
  loading: boolean;
  error: string | null;
  onRetry: () => Promise<void>;
}

export function FeedPage({ services, loading, error, onRetry }: FeedPageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const current = services.length ? services[activeIndex % services.length] : undefined;

  const goNext = useCallback(() => {
    setExpanded(false);
    setActiveIndex((index) => (index + 1) % Math.max(services.length, 1));
  }, [services.length]);

  if (loading) return <div className="state-screen"><Spinner animation="border" /><span>Загружаем mock-услуги…</span></div>;
  if (error) return <Alert variant="danger"><strong>Ошибка загрузки</strong><p className="mb-2">{error}</p><Button onClick={() => void onRetry()} variant="dark">Повторить</Button></Alert>;
  if (!current) return <Alert variant="secondary">В mock-коллекции пока нет опубликованных услуг.</Alert>;

  return (
    <section className="feed-page">
      <div className="page-heading page-heading--feed">
        <div><div className="eyebrow">ОТКРЫТЫЙ КАТАЛОГ</div><h1>Лента</h1></div>
        <span className="counter-pill">{activeIndex + 1} / {services.length}</span>
      </div>
      <article className="feed-card">
        <video
          className="feed-card__video"
          autoPlay
          loop
          muted
          playsInline
          controls
          poster={getImageSource(current.image_url)}
          key={current.id}
          onError={(event) => {
            const video = event.currentTarget;
            if (video.dataset.fallbackApplied === 'true') return;
            video.dataset.fallbackApplied = 'true';
            video.src = getVideoSource(null);
            video.load();
          }}
        >
          <source src={getVideoSource(current.video_url)} type="video/mp4" />
        </video>
        <div className="feed-card__shade" />
        <div className="feed-card__topline"><span>{current.category ?? 'Общее'}</span><span>♡ {current.likes_count}</span></div>
        <div className="feed-card__content">
          <div className="feed-card__description-block">
            <h2>{current.growth_factor_name}</h2>
            <p className={expanded ? 'description-text description-text--expanded' : 'description-text'}>{current.growth_factor_description}</p>
            <Button variant="link" className="description-toggle" onClick={() => setExpanded((value) => !value)}>
              {expanded ? 'Скрыть' : 'Читать далее'}
            </Button>
          </div>
          <div className="feed-card__stats">
            <div><span>РОСТ</span><strong>×{current.growth_coefficient?.toFixed(2) ?? '—'}</strong></div>
            <div><span>ВЛИЯНИЕ</span><strong>×{current.storage_impact_coefficient?.toFixed(2) ?? '—'}</strong></div>
          </div>
        </div>
      </article>
      <div className="feed-actions">
        <Button variant="outline-light" onClick={() => navigate(`/service/${current.id}`)}>Подробнее об услуге <span>↗</span></Button>
        <Button variant="light" className="btn-sand" onClick={goNext}>Следующая <span>→</span></Button>
      </div>
      <p className="page-footnote">Данные загружаются из локальной mock-коллекции. Авторизация и публикация отключены.</p>
    </section>
  );
}
