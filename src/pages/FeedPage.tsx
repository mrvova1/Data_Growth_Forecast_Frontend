import { useCallback, useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import type { Service } from '../types/service';
import { DEFAULT_VIDEO, getImageSource, getVideoSource } from '../utils/media';

interface FeedPageProps {
  services: Service[];
  loading: boolean;
  error: string | null;
  onRetry: () => Promise<void>;
}

export function FeedPage({ services, loading, error, onRetry }: FeedPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [videoFallbackFailed, setVideoFallbackFailed] = useState(false);

  const isSelectedRoute = id !== undefined;
  const selectedId = id === undefined ? undefined : Number(id);
  const selectedIndex =
    selectedId !== undefined && Number.isInteger(selectedId)
      ? services.findIndex((service) => service.id === selectedId)
      : -1;

  const currentIndex = isSelectedRoute
    ? selectedIndex
    : services.length > 0
      ? activeIndex % services.length
      : -1;
  const current = currentIndex >= 0 ? services[currentIndex] : undefined;

  useEffect(() => {
    setExpanded(false);
    setVideoFallbackFailed(false);
  }, [id, current?.id]);

  const goNext = useCallback(() => {
    setExpanded(false);
    setVideoFallbackFailed(false);

    if (services.length === 0) return;

    if (isSelectedRoute) {
      if (selectedIndex < 0) return;
      const nextService = services[(selectedIndex + 1) % services.length];
      navigate(`/feed/${nextService.id}`);
      return;
    }

    setActiveIndex((index) => (index + 1) % services.length);
  }, [isSelectedRoute, navigate, selectedIndex, services]);

  if (loading) {
    return (
      <div className="state-screen">
        <Spinner animation="border" />
        <span>Загружаем mock-услуги…</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <strong>Ошибка загрузки</strong>
        <p className="mb-2">{error}</p>
        <Button onClick={() => void onRetry()} variant="dark">
          Повторить
        </Button>
      </Alert>
    );
  }

  if (!current) {
    if (isSelectedRoute) {
      return (
        <Alert variant="warning">
          <h2 className="h6">Услуга не найдена</h2>
          <p>В mock-коллекции нет услуги с ID {id}.</p>
          <Button variant="dark" onClick={() => navigate('/tile')}>
            Вернуться к плитке
          </Button>
        </Alert>
      );
    }

    return (
      <Alert variant="secondary">
        В mock-коллекции пока нет опубликованных услуг.
      </Alert>
    );
  }

  const handleVideoError = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.dataset.fallbackApplied !== 'true') {
      video.dataset.fallbackApplied = 'true';
      video.src = DEFAULT_VIDEO;
      video.load();
      return;
    }
    setVideoFallbackFailed(true);
  };

  return (
    <section className="feed-page">
      <div className="page-heading page-heading--feed">
        <div>
          <div className="eyebrow">ОТКРЫТЫЙ КАТАЛОГ</div>
          <h1>{isSelectedRoute ? 'Просмотр услуги' : 'Лента'}</h1>
        </div>
        <span className="counter-pill">
          {currentIndex + 1} / {services.length}
        </span>
      </div>

      <article className="feed-card">
        {videoFallbackFailed ? (
          <img
            className="feed-card__video feed-card__fallback-image"
            src={getImageSource(current.image_url)}
            alt={current.growth_factor_name}
            onError={(event) => {
              const image = event.currentTarget;
              if (image.dataset.fallbackApplied === 'true') return;
              image.dataset.fallbackApplied = 'true';
              image.src = getImageSource(null);
            }}
          />
        ) : (
          <video
            key={current.id}
            className="feed-card__video"
            autoPlay
            loop
            muted
            playsInline
            controls
            poster={getImageSource(current.image_url)}
            src={getVideoSource(current.video_url)}
            onError={handleVideoError}
          />
        )}

        <div className="feed-card__shade" />

        <div className="feed-card__topline">
          <span>{current.category ?? 'Общее'}</span>
          <span>♡ {current.likes_count}</span>
        </div>

        <div className="feed-card__content">
          <div className="feed-card__description-block">
            <h2>{current.growth_factor_name}</h2>
            <p
              className={
                expanded
                  ? 'description-text description-text--expanded'
                  : 'description-text'
              }
            >
              {current.growth_factor_description || 'Описание отсутствует.'}
            </p>
            <Button
              variant="link"
              className="description-toggle"
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? 'Скрыть' : 'Читать далее'}
            </Button>
          </div>

          <div className="feed-card__stats">
            <div>
              <span>РОСТ</span>
              <strong>×{current.growth_coefficient?.toFixed(2) ?? '—'}</strong>
            </div>
            <div>
              <span>ВЛИЯНИЕ</span>
              <strong>
                ×{current.storage_impact_coefficient?.toFixed(2) ?? '—'}
              </strong>
            </div>
          </div>
        </div>

        <Button
          variant="light"
          className="feed-next-button"
          onClick={goNext}
          aria-label="Следующая услуга"
          title="Следующая услуга"
        >
          <span className="feed-next-button__arrow" aria-hidden="true">→</span>
          <span className="feed-next-button__label">Далее</span>
        </Button>
      </article>
    </section>
  );
}
