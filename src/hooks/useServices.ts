import { useCallback, useEffect, useState } from 'react';
import type { Service } from '../types/service';

interface ServicesState {
  services: Service[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/** Загружает статическую mock-коллекцию из public/mock/services.json. */
export function useServices(): ServicesState {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadServices = useCallback(async (signal?: AbortSignal): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/mock/services.json', { signal });
      if (!response.ok) {
        throw new Error(`Не удалось загрузить mock-коллекцию: HTTP ${response.status}`);
      }
      const data: unknown = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Файл mock/services.json должен содержать массив услуг.');
      }
      setServices(data as Service[]);
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === 'AbortError') return;
      setError(caught instanceof Error ? caught.message : 'Неизвестная ошибка загрузки.');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadServices(controller.signal);
    return () => controller.abort();
  }, [loadServices]);

  return { services, loading, error, refresh: () => loadServices() };
}
