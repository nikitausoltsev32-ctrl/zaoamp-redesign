import { 
  Mountain, 
  Sparkles, 
  Factory, 
  Ruler, 
  FlaskConical, 
  Box, 
  Users, 
  Package 
} from 'lucide-react'
import { LucideIcon } from 'lucide-react'

export interface Benefit {
  id: string
  icon: LucideIcon
  title: string
  description: string
}

export const benefits: Benefit[] = [
  {
    id: '1',
    icon: Mountain,
    title: 'Собственное месторождение',
    description: 'Добыча белого мрамора на собственном месторождении в Свердловской области'
  },
  {
    id: '2',
    icon: Sparkles,
    title: 'Белизна до 98%',
    description: 'Высочайшее качество мрамора с белизной до 98% по шкале Rd'
  },
  {
    id: '3',
    icon: Factory,
    title: '45 000 тонн/месяц',
    description: 'Производительность до 45 000 тонн продукции в месяц'
  },
  {
    id: '4',
    icon: Ruler,
    title: 'Точное фракционирование',
    description: 'Современное оборудование обеспечивает точное соответствие фракциям'
  },
  {
    id: '5',
    icon: FlaskConical,
    title: 'Химическая чистота',
    description: 'Содержание CaCO₃ ≥ 98%, минимальное количество примесей'
  },
  {
    id: '6',
    icon: Box,
    title: 'Кубическая форма зерна',
    description: 'Оптимальная форма частиц для строительных смесей и декора'
  },
  {
    id: '7',
    icon: Users,
    title: '300+ клиентов',
    description: 'Более 300 постоянных клиентов по всей России, 50 000+ тонн отгружено'
  },
  {
    id: '8',
    icon: Package,
    title: 'Упаковка до 1 тонны',
    description: 'Удобная фасовка в биг-бэги от 500 кг до 1 тонны, возможна навалом'
  }
]
