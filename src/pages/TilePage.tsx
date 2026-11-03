import { useMemo, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { ServiceCard } from '../components/ServiceCard';
import { ServiceFilters } from '../components/ServiceFilters';
import type { Service, ServiceSort } from '../types/service';

interface TilePageProps {
  services: Service[];
  loading: boolean;
  error: string | null;
}

export function TilePage({ services, loading, error }: TilePageProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [minGrowth, setMinGrowth] = useState('');
  const [sortBy, setSortBy] = useState<ServiceSort>('newest');

  const categories = useMemo(
    () => Array.from(new Set(services.map((service) => service.category ?? 'Общее'))).sort((a, b) => a.localeCompare(b, 'ru')),
    [services],
  );

  const filteredServices = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('ru');
    const filtered = services.filter((service) => {
      const matchesName = service.growth_factor_name.toLocaleLowerCase('ru').includes(normalizedSearch);
      const matchesCategory = category === 'all' || (service.category ?? 'Общее') === category;
      const matchesDate = !fromDate || service.created_at.slice(0, 10) >= fromDate;
      const matchesGrowth = minGrowth === '' || (service.growth_coefficient ?? 0) >= Number(minGrowth);
      return matchesName && matchesCategory && matchesDate && matchesGrowth;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'name') return a.growth_factor_name.localeCompare(b.growth_factor_name, 'ru');
      if (sortBy === 'growth') return (b.growth_coefficient ?? 0) - (a.growth_coefficient ?? 0);
      const dateOrder = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortBy === 'newest' ? -dateOrder : dateOrder;
    });
  }, [services, search, category, fromDate, minGrowth, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setFromDate('');
    setMinGrowth('');
    setSortBy('newest');
  };

  return (
    <section className="tile-page">
      <div className="page-heading">
        <div><div className="eyebrow">ВСЕ ОПУБЛИКОВАННЫЕ ЗАПИСИ</div><h1>Плитка</h1></div>
        <span className="counter-pill">{filteredServices.length} услуг</span>
      </div>
      <ServiceFilters
        search={search}
        category={category}
        fromDate={fromDate}
        minGrowth={minGrowth}
        sortBy={sortBy}
        categories={categories}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onFromDateChange={setFromDate}
        onMinGrowthChange={setMinGrowth}
        onSortChange={setSortBy}
        onReset={resetFilters}
      />
      {loading && <div className="state-screen"><Spinner animation="border" /><span>Загружаем mock-услуги…</span></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <>
          <div className="results-caption">Результаты поиска <strong>{filteredServices.length}</strong></div>
          {filteredServices.length ? (
            <div className="service-grid">
              {filteredServices.map((service) => <ServiceCard key={service.id} service={service} />)}
            </div>
          ) : (
            <Alert variant="secondary" className="empty-state">По выбранным фильтрам ничего не найдено. Измените условия поиска.</Alert>
          )}
        </>
      )}
    </section>
  );
}
