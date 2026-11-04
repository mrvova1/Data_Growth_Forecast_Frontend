import { Button, Form } from 'react-bootstrap';

export interface ServiceFiltersProps {
  category: string;
  minGrowth: string;
  categories: string[];
  onCategoryChange: (value: string) => void;
  onMinGrowthChange: (value: string) => void;
  onReset: () => void;
}

export function ServiceFilters(props: ServiceFiltersProps) {
  return (
    <section className="filter-panel" aria-label="Фильтры услуг">
      <div className="filter-panel__heading">
        <div>
          <div className="eyebrow">ФИЛЬТРАЦИЯ</div>
          <h2>Фильтры услуг</h2>
        </div>
        <Button variant="link" className="reset-filter" onClick={props.onReset}>Сбросить</Button>
      </div>

      <Form
        className="filter-grid"
        onSubmit={(event) => event.preventDefault()}
      >
        <Form.Group>
          <Form.Label>Тема</Form.Label>
          <Form.Select value={props.category} onChange={(event) => props.onCategoryChange(event.currentTarget.value)}>
            <option value="all">Все темы</option>
            {props.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Form.Select>
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
      </Form>
    </section>
  );
}
