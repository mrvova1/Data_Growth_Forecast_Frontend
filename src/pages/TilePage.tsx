import { useMemo, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';

import { ServiceCard } from '../components/ServiceCard';
import { ServiceFilters } from '../components/ServiceFilters';
import type { Service } from '../types/service';

interface TilePageProps {
  services: Service[];
  loading: boolean;
  error: string | null;
}

export function TilePage({ services, loading, error }: TilePageProps) {
  const [category, setCategory] = useState('all');
  const [minGrowth, setMinGrowth] = useState('');

  const categories = useMemo(
    () =>
      Array.from(
        new Set(services.map((service) => service.category ?? 'Общее')),
      ).sort((a, b) => a.localeCompare(b, 'ru')),
    [services],
  );

  const filteredServices = useMemo(
    () =>
      services.filter((service) => {
        const matchesCategory =
          category === 'all' || (service.category ?? 'Общее') === category;
        const matchesGrowth =
          minGrowth === '' ||
          (service.growth_coefficient ?? 0) >= Number(minGrowth);

        return matchesCategory && matchesGrowth;
      }),
    [services, category, minGrowth],
  );

  const resetFilters = () => {
    setCategory('all');
    setMinGrowth('');
  };

  return (
    <section className="tile-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">ВСЕ ОПУБЛИКОВАННЫЕ ЗАПИСИ</div>
          <h1>Плитка</h1>
        </div>
        <span className="counter-pill">{filteredServices.length} услуг</span>
      </div>

      <ServiceFilters
        category={category}
        minGrowth={minGrowth}
        categories={categories}
        onCategoryChange={setCategory}
        onMinGrowthChange={setMinGrowth}
        onReset={resetFilters}
      />

      {loading && (
        <div className="state-screen">
          <Spinner animation="border" />
          <span>Загружаем mock-услуги…</span>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          <div className="results-caption">
            Найдено услуг <strong>{filteredServices.length}</strong>
          </div>

          {filteredServices.length > 0 ? (
            <div className="service-grid">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <Alert variant="secondary" className="empty-state">
              По выбранным фильтрам ничего не найдено. Измените условия.
            </Alert>
          )}
        </>
      )}
    </section>
  );
}
