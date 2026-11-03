import { Button, Form } from 'react-bootstrap';
import type { ServiceSort } from '../types/service';

export interface ServiceFiltersProps {
  search: string;
  category: string;
  fromDate: string;
  minGrowth: string;
  sortBy: ServiceSort;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onMinGrowthChange: (value: string) => void;
  onSortChange: (value: ServiceSort) => void;
  onReset: () => void;
}

export function ServiceFilters(props: ServiceFiltersProps) {
  return (
    <section className="filter-panel" aria-label="Фильтры услуг">
      <div className="filter-panel__heading">
        <div>
          <div className="eyebrow">ПОИСК И ФИЛЬТРАЦИЯ</div>
          <h2>Найти услугу</h2>
        </div>
        <Button variant="link" className="reset-filter" onClick={props.onReset}>Сбросить</Button>
      </div>
      <Form className="filter-grid" onSubmit={(event) => event.preventDefault()}>
        <Form.Group className="filter-grid__wide">
          <Form.Label>Название</Form.Label>
          <Form.Control
            value={props.search}
            onChange={(event) => props.onSearchChange(event.currentTarget.value)}
            placeholder="Например, пользователи"
            aria-label="Поиск по названию"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Тема</Form.Label>
          <Form.Select value={props.category} onChange={(event) => props.onCategoryChange(event.currentTarget.value)}>
            <option value="all">Все темы</option>
            {props.categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Дата от</Form.Label>
          <Form.Control type="date" value={props.fromDate} onChange={(event) => props.onFromDateChange(event.currentTarget.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Рост от</Form.Label>
          <Form.Control
            type="number"
            min="1"
            max="2"
            step="0.01"
            value={props.minGrowth}
            onChange={(event) => props.onMinGrowthChange(event.currentTarget.value)}
            placeholder="1.00"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Сортировка</Form.Label>
          <Form.Select value={props.sortBy} onChange={(event) => props.onSortChange(event.currentTarget.value as ServiceSort)}>
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
            <option value="name">По названию</option>
            <option value="growth">По коэффициенту роста</option>
          </Form.Select>
        </Form.Group>
      </Form>
    </section>
  );
}
