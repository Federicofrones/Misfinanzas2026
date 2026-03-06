export interface GroupingRule {
    normalizedGroup: string;
    keywords: string[];
}

// Configurable grouping rules for generic transactions
export const groupingRules: GroupingRule[] = [
    {
        normalizedGroup: 'agua_bidones',
        keywords: ['bidon', 'bidón', 'agua 6l', 'salus 6l', 'agua bidon', 'agua']
    },
    {
        normalizedGroup: 'lacteos_leche',
        keywords: ['leche', 'leche entera', 'leche descremada', 'leche deslactosada']
    },
    {
        normalizedGroup: 'combustible_auto',
        keywords: ['nafta', 'combustible', 'super 95', 'premium 97', 'gasoil', 'estacion']
    },
    {
        normalizedGroup: 'panificados',
        keywords: ['pan', 'flauta', 'felipe', 'galleta', 'panaderia']
    },
    {
        normalizedGroup: 'limpieza_hogar',
        keywords: ['jabon', 'detergente', 'suavizante', 'lavandina', 'hipoclorito', 'limpiador']
    },
    {
        normalizedGroup: 'farmacia_salud',
        keywords: ['ibuprofeno', 'paracetamol', 'farmacia', 'medicamentos', 'remedios']
    },
    {
        normalizedGroup: 'carne_roja',
        keywords: ['carne', 'picada', 'asado', 'colita de cuadril', 'carniceria']
    },
    {
        normalizedGroup: 'frutas_verduras',
        keywords: ['fruta', 'verdura', 'manzana', 'banana', 'tomate', 'cebolla', 'papa', 'lechuga', 'feria']
    }
];
