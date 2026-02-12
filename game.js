// COSTÓPOLIS - Game State Management
const gameState = {
    currentCity: 0,
    currentScene: 'home',
    score: 0,
    costocoins: 10,
    health: 100,
    combo: 0,
    cu: { actual: 0, objetivo: 0 },
    merma: 0,
    margen: 0,
    time: 0,
    timer: null,
    citiesCompleted: [],
    medals: {},
    zonesVisited: [],
    cardsClassified: [],
    correctAnswers: 0,
    totalQuestions: 0,
    draggedCard: null,
    explorationData: {}
};

// City Data Configuration - CADA CIUDAD ES ÚNICA
const cityData = {
    1: {
        name: "Barrio de los Costos",
        emoji: "🏛️",
        objective: "Clasificar costos: directo/indirecto, fijo/variable",
        briefingText: "¡Hola! Soy el Contador Jefe. En esta ciudad aprenderás a clasificar costos correctamente. Es fundamental distinguir entre costos directos e indirectos, fijos y variables, y costos de producto vs periodo. ¡Vamos a comenzar!",
        goals: [
            "Clasificar correctamente ≥85% de las tarjetas",
            "Identificar 2 costos trampa",
            "Mantener Salud de Costos ≥70"
        ],
        cards: [
            { name: "Madera para muebles", type: "MPD", trap: false },
            { name: "Tornillos y clavos", type: "CIF", trap: false },
            { name: "Ensamblador de muebles", type: "MOD", trap: false },
            { name: "Supervisor de planta", type: "CIF", trap: false },
            { name: "Pintura para acabado", type: "MPD", trap: false },
            { name: "Energía eléctrica planta", type: "CIF", trap: false },
            { name: "Depreciación máquina", type: "CIF", trap: true },
            { name: "Comisiones ventas", type: "GV", trap: true },
            { name: "Sueldo contador", type: "GA", trap: false },
            { name: "Alquiler oficina admin", type: "GA", trap: false },
            { name: "Publicidad", type: "GV", trap: false },
            { name: "Papelería oficina", type: "GA", trap: false },
            { name: "Cortador de madera", type: "MOD", trap: false },
            { name: "Lijador", type: "MOD", trap: false },
            { name: "Mantenimiento máquinas", type: "CIF", trap: false },
            { name: "Seguro de planta", type: "CIF", trap: false },
            { name: "Tela para tapizado", type: "MPD", trap: false },
            { name: "Pegamento industrial", type: "CIF", trap: false },
            { name: "Inspector calidad", type: "CIF", trap: false },
            { name: "Transporte ventas", type: "GV", trap: false },
            { name: "Software contable", type: "GA", trap: false },
            { name: "Gerente general", type: "GA", trap: false },
            { name: "Vendedor", type: "GV", trap: false },
            { name: "Laca protectora", type: "MPD", trap: false }
        ],
        zones: {
            bodega: {
                name: "Bodega",
                emoji: "📦",
                data: ["Madera: MP directa (va al producto)", "Tornillos: MP indirecta (difícil de rastrear)", "Inventario: 500 kg madera en stock"]
            },
            produccion: {
                name: "Producción",
                emoji: "⚙️",
                data: ["MOD: 160 horas/mes (trabajadores directos)", "Supervisor: indirecto (no toca producto)", "Mantenimiento: $800/mes (CIF)"]
            },
            calidad: {
                name: "Calidad",
                emoji: "✅",
                data: ["Inspecciones: 2 por lote", "Merma normal: 2% aceptable", "Reproceso: 1% de unidades"]
            }
        },
        puzzle: [
            {
                question: "¿Cuántos costos DIRECTOS identificaste? (MPD + MOD)",
                answer: 7,
                hint: "Cuenta: Madera, Pintura, Tela, Laca (MPD) + Ensamblador, Cortador, Lijador (MOD) = 7"
            },
            {
                question: "¿Cuántos costos indirectos de fabricación (CIF)?",
                answer: 8,
                hint: "Incluye: Tornillos, Supervisor, Energía, Depreciación, Mantenimiento, Seguro, Pegamento, Inspector"
            }
        ],
        decisions: [
            {
                text: "A) Capacitar al bodeguero (↑precisión, -2 COSTOCOINS)",
                effect: { health: 10, coins: -2, merma: -1 },
                feedback: "¡Buena decisión! La capacitación mejora la precisión en clasificación."
            },
            {
                text: "B) Comprar lector códigos (↓errores futuros, ↑costo fijo)",
                effect: { health: 15, cu: 0.5, coins: -3 },
                feedback: "Inversión inteligente. Automatización reduce errores pero aumenta costos fijos."
            },
            {
                text: "C) No hacer nada (ahorras ahora, riesgo futuro)",
                effect: { health: -5, merma: 2 },
                feedback: "Ahorraste dinero, pero los errores de clasificación aumentarán."
            }
        ],
        cu: { actual: 5.8, objetivo: 6.0 },
        merma: 2,
        margen: 30
    },
    2: {
        name: "Kardex Park",
        emoji: "📦",
        objective: "Inventarios y Valuación: FIFO vs Promedio",
        briefingText: "Caso ejecutivo: la gerencia requiere cuantificar el impacto de PEPS vs Promedio en Costo de Ventas, Inventario Final, CU y margen bruto, considerando merma física. El reto se evalúa por exactitud, trazabilidad del cálculo y decisión recomendada.",
        goals: [
            "CU ≤ objetivo (≤ $6.40)",
            "Merma ≤ 4%",
            "Margen contribución ≥ 28%"
        ],
        // ACTIVIDAD ÚNICA: Simulador de Kardex
        gameType: "kardex-simulator",
        caseTimeLimit: 240,
        caseSubtitle: "Reto profesional: valida cálculos, controla redondeo y cierra con criterio gerencial.",
        caseStageLabel: "Caso aplicado (nivel profesional): exactitud + trazabilidad + decisión." ,
        kardexData: {
            purchases: [
                { date: "01/01", units: 100, price: 5.00 },
                { date: "15/01", units: 80, price: 6.00 },
                { date: "28/01", units: 120, price: 7.00 }
            ],
            sales: { units: 150, price: 9.50 },
            waste: 10
        },
        zones: {
            almacen: {
                name: "Almacén",
                emoji: "🏪",
                data: ["Compra 1: 100u @ $5.00 (01/01)", "Compra 2: 80u @ $6.00 (15/01)", "Compra 3: 120u @ $7.00 (28/01)"]
            },
            ventas: {
                name: "Ventas",
                emoji: "💰",
                data: ["Unidades vendidas: 150u", "Precio venta: $9.50/u", "Merma detectada: 10u (3.3%)"]
            },
            control: {
                name: "Control",
                emoji: "📊",
                data: ["Merma normal: 3% (aceptable)", "Merma anormal: 0.3% (investigar)", "Causa: manipulación en almacén"]
            }
        },
        puzzle: [
            {
                question: "Método PEPS - Costo de ventas (150u vendidas + 10u merma)",
                answer: 1000,
                hint: "PEPS: Salen primero las 100u@$5 + 60u@$6 = $500 + $360 + merma 10u restantes"
            },
            {
                question: "Método Promedio - Costo unitario promedio (2 decimales)",
                answer: 6.17,
                hint: "Total: ($500 + $480 + $840) / 300u = $6.17 por unidad"
            },
            {
                question: "¿Cuántas unidades quedan en inventario final?",
                answer: 140,
                hint: "Total disponible 300u - Vendidas 150u - Merma 10u = 140u"
            }
        ],
        decisions: [
            {
                text: "A) Control calidad estricto (↓merma 2%, ↑CIF pequeño)",
                effect: { health: 15, merma: -2, cu: 0.2 },
                feedback: "Excelente. Reducir merma mejora rentabilidad aunque aumenta costos fijos."
            },
            {
                text: "B) Comprar lotes grandes con descuento (↓precio, ↑inventario)",
                effect: { health: 5, cu: -0.3, coins: 3 },
                feedback: "Descuentos por volumen reducen costo pero aumentan capital inmovilizado."
            },
            {
                text: "C) Compras frecuentes pequeñas (↓inventario, riesgo quiebre)",
                effect: { health: -5, cu: 0.1, merma: 1 },
                feedback: "Riesgoso. Inventario bajo puede causar quiebres de stock."
            }
        ],
        cu: { actual: 6.17, objetivo: 6.40 },
        merma: 3.3,
        margen: 28
    },
    3: {
        name: "Órdenlandia",
        emoji: "📋",
        objective: "Costeo por Órdenes: CIF predeterminado y cotización",
        briefingText: "Caso de control gerencial: definir una tasa predeterminada de CIF basada en el driver que mejor explica la causalidad (enfoque técnico), aplicar CIF a una orden, calcular costo unitario y emitir una cotización con margen objetivo.",
        goals: [
            "Calcular MPD + MOD + CIF aplicado",
            "Cerrar orden correctamente",
            "CIF aplicado sin errores"
        ],
        // ACTIVIDAD ÚNICA: Hoja de Costos por Orden
        gameType: "job-order",
        caseTimeLimit: 300,
        caseSubtitle: "Reto profesional: valida cálculos, controla redondeo y cierra con criterio gerencial.",
        caseStageLabel: "Caso aplicado (nivel profesional): exactitud + trazabilidad + decisión." ,
        orderData: {
            cifRate: 12, // $ por hora MOD
            orders: [
                { id: 101, mpd: 480, modHours: 22, modRate: 10, units: 40 },
                { id: 102, mpd: 360, modHours: 18, modRate: 10, units: 30 }
            ]
        },
        zones: {
            requisiciones: {
                name: "Requisiciones",
                emoji: "📝",
                data: ["Orden #101: MPD $480 (madera premium)", "Orden #102: MPD $360 (madera estándar)", "Material indirecto: $120 (tornillos, pegamento)"]
            },
            horas: {
                name: "Horas Trabajadas",
                emoji: "⏰",
                data: ["Orden #101: 22h MOD @ $10/h = $220", "Orden #102: 18h MOD @ $10/h = $180", "Tasa CIF predeterminada: $12 por hora MOD"]
            },
            verificacion: {
                name: "Verificación",
                emoji: "✔️",
                data: ["Orden #101: 40 unidades terminadas", "Orden #102: 30 unidades terminadas", "Inspección: Ambas órdenes aprobadas"]
            }
        },
        puzzle: [
            {
                question: "CIF aplicado Orden #101 (22h × $12/h)",
                answer: 264,
                hint: "Horas MOD × Tasa CIF predeterminada = 22 × 12"
            },
            {
                question: "Costo TOTAL Orden #101 (MPD + MOD + CIF)",
                answer: 964,
                hint: "MPD $480 + MOD $220 + CIF $264 = $964"
            },
            {
                question: "Costo UNITARIO Orden #101 (40 unidades, 2 decimales)",
                answer: 24.10,
                hint: "Costo total $964 / 40 unidades = $24.10 por unidad"
            }
        ],
        decisions: [
            {
                text: "A) Cambiar base CIF a horas-máquina (mejor para automatización)",
                effect: { health: 10, cu: -0.2 },
                feedback: "Buena idea si la planta está automatizada. Refleja mejor el consumo de CIF."
            },
            {
                text: "B) Mantener horas MOD como base (simple pero puede sesgar)",
                effect: { health: 5, cu: 0 },
                feedback: "Fácil de aplicar pero puede distorsionar costos en procesos automatizados."
            },
            {
                text: "C) Usar 2 tasas CIF por departamento (↑exactitud, ↑trabajo)",
                effect: { health: 20, cu: -0.5, coins: -1 },
                feedback: "¡Excelente! Más trabajo pero costos mucho más precisos por departamento."
            }
        ],
        cu: { actual: 24.10, objetivo: 25.00 },
        merma: 1,
        margen: 32
    },
    4: {
        name: "Procesópolis",
        emoji: "⚙️",
        objective: "Costeo por Procesos: Unidades equivalentes (WA)",
        briefingText: "Caso de planta: con BWIP/EWIP y porcentajes de avance, calcula unidades equivalentes (WA), costos por EU y asignación de costos. Se evalúa consistencia matemática y control de redondeo.",
        goals: [
            "Calcular Unidades Equivalentes correctamente",
            "Asignar costos: terminados vs WIP",
            "Diferenciar materiales vs conversión"
        ],
        // ACTIVIDAD ÚNICA: Calculadora de UEQ
        gameType: "process-costing",
        caseTimeLimit: 360,
        caseSubtitle: "Reto profesional: valida cálculos, controla redondeo y cierra con criterio gerencial.",
        caseStageLabel: "Caso aplicado (nivel profesional): exactitud + trazabilidad + decisión." ,
        processData: {
            unitsStarted: 1000,
            unitsCompleted: 800,
            wipUnits: 200,
            wipMaterialsPct: 100,
            wipConversionPct: 60,
            materialsCost: 5000,
            conversionCost: 3600
        },
        zones: {
            materiales: {
                name: "Materiales",
                emoji: "🧱",
                data: ["Costos materiales periodo: $5,000", "Unidades iniciadas: 1,000", "Materiales: 100% al inicio del proceso"]
            },
            proceso: {
                name: "Proceso",
                emoji: "🔄",
                data: ["Unidades terminadas: 800", "WIP final: 200 unidades", "WIP conversión: 60% de avance"]
            },
            conversion: {
                name: "Conversión",
                emoji: "⚡",
                data: ["Costos conversión: $3,600 (MOD + CIF)", "Conversión gradual durante proceso", "Merma normal proceso: 2%"]
            }
        },
        puzzle: [
            {
                question: "UEQ Materiales = Terminadas + (WIP × % materiales)",
                answer: 1000,
                hint: "800 + (200 × 100%) = 800 + 200 = 1,000 UEQ"
            },
            {
                question: "UEQ Conversión = Terminadas + (WIP × % conversión)",
                answer: 920,
                hint: "800 + (200 × 60%) = 800 + 120 = 920 UEQ"
            },
            {
                question: "Costo por UEQ Materiales ($5,000 / UEQ, 2 decimales)",
                answer: 5.00,
                hint: "$5,000 / 1,000 UEQ = $5.00 por UEQ"
            },
            {
                question: "Costo por UEQ Conversión ($3,600 / UEQ, 2 decimales)",
                answer: 3.91,
                hint: "$3,600 / 920 UEQ = $3.913... ≈ $3.91"
            }
        ],
        decisions: [
            {
                text: "A) Implementar control desperdicio (↓conversión perdida)",
                effect: { health: 15, merma: -2, cu: -0.3 },
                feedback: "¡Perfecto! Controlar desperdicio en proceso reduce costos significativamente."
            },
            {
                text: "B) Acelerar producción (↑unidades, pero riesgo reproceso)",
                effect: { health: -5, merma: 3, cu: 0.2 },
                feedback: "Cuidado. Velocidad excesiva aumenta defectos y reprocesos."
            },
            {
                text: "C) Implementar FIFO (↑exactitud para cambios de costo)",
                effect: { health: 20, cu: -0.5, coins: -2 },
                feedback: "Método FIFO es más exacto cuando hay cambios de precios, pero más complejo."
            }
        ],
        cu: { actual: 8.91, objetivo: 9.20 },
        merma: 2,
        margen: 35
    },
    5: {
        name: "ABC Towers",
        emoji: "🏢",
        objective: "ABC: Drivers, cost pools y rentabilidad",
        briefingText: "Caso de rentabilidad: construir tasas de cost drivers, asignar CIF por ABC y justificar una recomendación (mantener/reprecio/rediseñar) en función de margen bruto objetivo.",
        goals: [
            "Identificar pools y drivers correctos",
            "Evitar subsidio cruzado",
            "Calcular costo real por producto"
        ],
        // ACTIVIDAD ÚNICA: Asignación ABC
        gameType: "abc-costing",
        caseTimeLimit: 360,
        caseSubtitle: "Reto profesional: valida cálculos, controla redondeo y cierra con criterio gerencial.",
        caseStageLabel: "Caso aplicado (nivel profesional): exactitud + trazabilidad + decisión." ,
        abcData: {
            activities: [
                { name: "Setup", cost: 2400, driver: "setups", totalDriver: 40 },
                { name: "Inspección", cost: 1600, driver: "inspecciones", totalDriver: 30 },
                { name: "Despacho", cost: 2000, driver: "despachos", totalDriver: 50 }
            ],
            products: [
                { name: "A", units: 500, setups: 10, inspections: 20, shipments: 30 },
                { name: "B", units: 200, setups: 30, inspections: 10, shipments: 20 }
            ]
        },
        zones: {
            actividades: {
                name: "Actividades",
                emoji: "🎯",
                data: ["Setup máquinas: $2,400", "Inspección calidad: $1,600", "Despacho pedidos: $2,000"]
            },
            productos: {
                name: "Productos",
                emoji: "📦",
                data: ["Producto A: 500 unidades", "Producto B: 200 unidades", "Cada uno consume drivers diferentes"]
            },
            drivers: {
                name: "Cost Drivers",
                emoji: "🔑",
                data: ["Setups totales: A=10, B=30 (total 40)", "Inspecciones: A=20, B=10 (total 30)", "Despachos: A=30, B=20 (total 50)"]
            }
        },
        puzzle: [
            {
                question: "Tasa Setup = $2,400 / 40 setups totales",
                answer: 60,
                hint: "Costo pool / Total driver = $2,400 / 40 = $60 por setup"
            },
            {
                question: "CIF Setup asignado a Producto A (10 setups × tasa)",
                answer: 600,
                hint: "10 setups × $60 = $600"
            },
            {
                question: "Tasa Inspección = $1,600 / 30 inspecciones (2 decimales)",
                answer: 53.33,
                hint: "$1,600 / 30 = $53.333... ≈ $53.33 por inspección"
            },
            {
                question: "Tasa Despacho = $2,000 / 50 despachos",
                answer: 40,
                hint: "$2,000 / 50 = $40 por despacho"
            }
        ],
        decisions: [
            {
                text: "A) Reducir setups con SMED (↓tiempo cambio, ↓costo real)",
                effect: { health: 20, cu: -0.8, coins: -3 },
                feedback: "¡Excelente estrategia Lean! SMED reduce drásticamente tiempos de setup."
            },
            {
                text: "B) Subir precio al producto que consume más actividades",
                effect: { health: 10, margen: 5, cu: 0 },
                feedback: "Correcto. El producto B consume más setups, debe tener precio mayor."
            },
            {
                text: "C) Simplificar portafolio (eliminar producto problemático)",
                effect: { health: 15, cu: -0.5, margen: 3 },
                feedback: "Decisión difícil pero a veces necesaria. Enfoque en productos rentables."
            }
        ],
        cu: { actual: 12.50, objetivo: 13.00 },
        merma: 1.5,
        margen: 38
    },
    6: {
        name: "Estándar City",
        emoji: "📊",
        objective: "Costos Estándar: Variaciones y diagnóstico",
        briefingText: "Caso de control presupuestario: calcula variaciones de MP y MOD, interpreta drivers dominantes (precio/tarifa vs eficiencia/uso) y concluye con una hipótesis de causa raíz.",
        goals: [
            "Calcular variaciones MP (precio/cantidad)",
            "Calcular variaciones MOD (tarifa/eficiencia)",
            "Analizar causas de variaciones"
        ],
        // ACTIVIDAD ÚNICA: Análisis de Variaciones
        gameType: "standard-costing",
        caseTimeLimit: 300,
        caseSubtitle: "Reto profesional: valida cálculos, controla redondeo y cierra con criterio gerencial.",
        caseStageLabel: "Caso aplicado (nivel profesional): exactitud + trazabilidad + decisión." ,
        standardData: {
            production: 1000,
            materials: {
                stdQtyPerUnit: 2,
                stdPrice: 3,
                actualQtyPerUnit: 2.2,
                actualPrice: 3.4
            },
            labor: {
                stdHoursPerUnit: 0.5,
                stdRate: 12,
                actualHoursPerUnit: 0.55,
                actualRate: 12.5
            }
        },
        zones: {
            estandares: {
                name: "Estándares",
                emoji: "📏",
                data: ["Estándar MP: 2 kg/u @ $3/kg", "Estándar MOD: 0.5h/u @ $12/h", "Producción planeada: 1,000 unidades"]
            },
            reales: {
                name: "Datos Reales",
                emoji: "📈",
                data: ["Real MP: 2.2 kg/u @ $3.40/kg", "Real MOD: 0.55h/u @ $12.50/h", "Producción real: 1,000 unidades"]
            },
            analisis: {
                name: "Análisis",
                emoji: "🔍",
                data: ["Variaciones MP: precio y cantidad", "Variaciones MOD: tarifa y eficiencia", "Causas: proveedor, capacitación, proceso"]
            }
        },
        puzzle: [
            {
                question: "Variación PRECIO MP = (Precio real - Std) × Cantidad real total",
                answer: 880,
                hint: "($3.40 - $3.00) × (2.2 kg/u × 1,000u) = $0.40 × 2,200 kg = $880 Desfavorable"
            },
            {
                question: "Variación CANTIDAD MP = (Qty real - Std permitida) × Precio std",
                answer: 600,
                hint: "(2,200 kg - 2,000 kg) × $3.00 = 200 kg × $3.00 = $600 Desfavorable"
            },
            {
                question: "Variación TARIFA MOD = (Tarifa real - Std) × Horas reales",
                answer: 275,
                hint: "($12.50 - $12.00) × (0.55h/u × 1,000u) = $0.50 × 550h = $275 Desfavorable"
            },
            {
                question: "Variación EFICIENCIA MOD = (Horas reales - Std) × Tarifa std",
                answer: 600,
                hint: "(550h - 500h) × $12.00 = 50h × $12.00 = $600 Desfavorable"
            }
        ],
        decisions: [
            {
                text: "A) Renegociar con proveedor (↓precio MP, mejor calidad)",
                effect: { health: 15, cu: -0.4, coins: 2 },
                feedback: "Buena negociación. Reducir precio de MP mejora margen directamente."
            },
            {
                text: "B) Capacitar trabajadores (↓cantidad MP, ↑eficiencia MOD)",
                effect: { health: 20, cu: -0.6, merma: -1 },
                feedback: "¡Inversión inteligente! Capacitación reduce desperdicios y mejora eficiencia."
            },
            {
                text: "C) Aceptar calidad superior MP (↑precio, pero ↓scrap)",
                effect: { health: 10, cu: 0.2, merma: -3 },
                feedback: "Trade-off interesante. Pagar más pero reducir merma puede ser rentable."
            }
        ],
        cu: { actual: 9.15, objetivo: 9.00 },
        merma: 1,
        margen: 40
    },
    boss: {
        name: "El Cuello de Botella",
        emoji: "👹",
        objective: "Mix Óptimo bajo Restricción",
        briefingText: "¡Has llegado al desafío final! El Cuello de Botella te reta a tomar la decisión más importante: ¿Qué producir cuando los recursos son limitados? Aprenderás Teoría de Restricciones (TOC) y optimización. ¡Suerte!",
        goals: [
            "Calcular contribución por recurso escaso",
            "Optimizar mix de producción",
            "Maximizar contribución total"
        ],
        // ACTIVIDAD ÚNICA: Optimización TOC
        gameType: "bottleneck",
        bottleneckData: {
            capacity: 600, // minutos/día
            products: [
                { name: "A", contribution: 8, timePerUnit: 4, demand: 999 },
                { name: "B", contribution: 10, timePerUnit: 8, demand: 50 }
            ],
            urgentOrder: { product: "B", priceIncrease: 15 }
        },
        zones: {
            productos: {
                name: "Productos",
                emoji: "📦",
                data: ["Producto A: Contribución $8/u", "Producto B: Contribución $10/u", "Capacidad máquina: 600 min/día"]
            },
            restriccion: {
                name: "Restricción",
                emoji: "⚠️",
                data: ["Máquina X: cuello de botella", "Prod A: 4 min/u (rápido)", "Prod B: 8 min/u (lento)"]
            },
            demanda: {
                name: "Demanda",
                emoji: "📊",
                data: ["Demanda A: ilimitada", "Demanda B: 50u/día máximo", "Pedido urgente B: precio +15%"]
            }
        },
        puzzle: [
            {
                question: "Contribución por MINUTO Producto A ($8 / 4 min, 2 decimales)",
                answer: 2.00,
                hint: "Contribución unitaria / Minutos por unidad = $8 / 4 = $2.00 por minuto"
            },
            {
                question: "Contribución por MINUTO Producto B ($10 / 8 min, 2 decimales)",
                answer: 1.25,
                hint: "$10 / 8 min = $1.25 por minuto (MENOR que A, producir A primero)"
            },
            {
                question: "¿Cuántas unidades de A producir si priorizas por contrib/min?",
                answer: 150,
                hint: "600 minutos / 4 min por unidad = 150 unidades de A"
            },
            {
                question: "Contribución TOTAL si produces solo A (150u × $8)",
                answer: 1200,
                hint: "150 unidades × $8 contribución = $1,200 total"
            }
        ],
        decisions: [
            {
                text: "A) Horas extra (↑capacidad, pero ↑costo fijo y MOD)",
                effect: { health: 10, cu: 1.5, margen: -2, coins: 5 },
                feedback: "Aumentas capacidad pero a mayor costo. Evalúa si el margen lo justifica."
            },
            {
                text: "B) Subcontratar etapa (↓margen, pero libera cuello de botella)",
                effect: { health: 15, cu: 0.8, margen: -5, coins: 8 },
                feedback: "Pierdes margen pero ganas capacidad. Puede ser rentable si la demanda lo justifica."
            },
            {
                text: "C) Reprogramar mix (prioriza contribución/minuto, ¡óptimo!)",
                effect: { health: 25, cu: 0, margen: 8, coins: 10 },
                feedback: "¡PERFECTO! Esta es la decisión óptima según TOC. Maximizas contribución."
            }
        ],
        cu: { actual: 15.00, objetivo: 16.00 },
        merma: 0.5,
        margen: 45
    }
};

// Initialize Game
function initGame() {
    updateHUD();
    startTimer();
    
    // COSTI interaction
    const costiMain = document.getElementById('costi-main');
    if (costiMain) {
        costiMain.addEventListener('click', () => {
            showMessage("¡Hola! Soy COSTI 🎮<br>Tu guía en COSTÓPOLIS.<br>¡Haz clic en JUGAR para comenzar!");
            addCoins(1);
        });
    }
}

// Start Game
function startGame() {
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('city-map').classList.remove('hidden');
    gameState.currentScene = 'map';
    
    // TODAS LAS CIUDADES DESBLOQUEADAS DESDE EL INICIO
    for (let i = 1; i <= 6; i++) {
        unlockCity(i);
    }
    unlockCity('boss');
}

// Back to Home
function backToHome() {
    document.getElementById('city-map').classList.add('hidden');
    document.getElementById('city-game').classList.add('hidden');
    document.getElementById('home-screen').classList.remove('hidden');
    gameState.currentScene = 'home';
}

// Unlock City
function unlockCity(cityNum) {
    const cityCard = document.querySelector(`[data-city="${cityNum}"]`);
    if (cityCard) {
        cityCard.classList.remove('locked');
        cityCard.style.cursor = 'pointer';
        cityCard.onclick = () => selectCity(cityNum);
        
        const medalId = `medal-${cityNum}`;
        const medalElement = document.getElementById(medalId);
        if (medalElement && !gameState.medals[cityNum]) {
            medalElement.textContent = '🔓';
        }
    }
}

// Select City
function selectCity(cityNum) {
    const city = cityData[cityNum];
    if (!city) return;
    
    gameState.currentCity = cityNum;
    gameState.currentScene = 'briefing';
    gameState.zonesVisited = [];
    gameState.cardsClassified = [];
    gameState.correctAnswers = 0;
    gameState.totalQuestions = 0;
    gameState.explorationData = {};
    
    // Reset score for this city
    gameState.score = 0;
    
    // Update HUD with city data
    gameState.cu = { ...city.cu };
    gameState.merma = city.merma;
    gameState.margen = city.margen;
    updateHUD();
    
    // Show city game screen
    document.getElementById('city-map').classList.add('hidden');
    document.getElementById('city-game').classList.remove('hidden');
    
    // Update city info
    document.getElementById('city-title').textContent = cityNum === 'boss' ? 'BOSS FINAL' : `CIUDAD ${cityNum}`;
    document.getElementById('city-name').textContent = city.name;
    
    // Update briefing
    document.getElementById('briefing-text').textContent = city.briefingText;
    
    const goalsList = document.getElementById('briefing-goals');
    goalsList.innerHTML = city.goals.map(goal => `<li class="text-gray-200">✓ ${goal}</li>`).join('');
    
    // Show briefing scene
    showScene('briefing');
}

// Show Scene
function showScene(sceneName) {
    // Hide all scenes
    ['scene-briefing', 'scene-atrapa', 'scene-explora', 'scene-puzzle'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.classList.add('hidden');
    });
    
    // Show selected scene
    const sceneElement = document.getElementById(`scene-${sceneName}`);
    if (sceneElement) {
        sceneElement.classList.remove('hidden');
    }
    gameState.currentScene = sceneName;
}


// Start Mission (ruteo inteligente por ciudad)
function startMission() {
    // Flujo unificado e interactivo para TODAS las ciudades:
    // briefing → atrapa (si existe) → explora → puzzle/case.
    startScene('atrapa');
}

// Start Scene
function startScene(sceneName) {
    showScene(sceneName);
    
    if (sceneName === 'atrapa') {
        initCardGame();
    } else if (sceneName === 'explora') {
        initExploration();
    } else if (sceneName === 'puzzle') {
        initPuzzle();
    }
}

// Card Classification Game - MEJORADO CON DRAG & DROP BIDIRECCIONAL
function initCardGame() {
    const city = cityData[gameState.currentCity];

    // Si la ciudad no tiene tarjetas configuradas, generar set dinámico
    // a partir de preguntas/respuestas del caso para mantener interacción.
    if (!city.cards || city.cards.length === 0) {
        city.cards = createDynamicCardsForCity(city);
    }
    
    const cardsGrid = document.getElementById('cards-grid');
    
    gameState.score = 0;
    gameState.combo = 0;
    gameState.correctAnswers = 0;
    gameState.totalQuestions = city.cards.length;
    gameState.cardsClassified = [];
    
    updateGameScore();
    
    // Shuffle and display cards
    const shuffledCards = [...city.cards].sort(() => Math.random() - 0.5);
    
    cardsGrid.innerHTML = shuffledCards.map((card, index) => `
        <div class="card-item bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-3 cursor-move border-2 border-blue-400 hover:scale-105 transition-transform animate-fade-in"
             draggable="true"
             data-card-id="${index}"
             data-card-name="${card.name}"
             data-card-type="${card.type}"
             data-is-trap="${card.trap}"
             ondragstart="dragStart(event)"
             ondragend="dragEnd(event)">
            <div class="text-xs font-bold text-white text-center">${card.name}</div>
            ${card.trap ? '<div class="text-center text-yellow-400 text-xs mt-1">⚠️</div>' : ''}
        </div>
    `).join('');
    
    // Setup drop zones (including cards container for return)
    setupDropZones();
}

function setupDropZones() {
    const dropZones = document.querySelectorAll('.drop-zone, #cards-container');
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('ring-4', 'ring-yellow-400');
        });
        
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('ring-4', 'ring-yellow-400');
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('ring-4', 'ring-yellow-400');
            
            const cardId = e.dataTransfer.getData('cardId');
            const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
            
            if (cardElement) {
                // Si se suelta en cards-container, volver al área de tarjetas
                if (zone.id === 'cards-container') {
                    const cardsGrid = document.getElementById('cards-grid');
                    cardsGrid.appendChild(cardElement);
                    
                    // Remover de clasificados
                    gameState.cardsClassified = gameState.cardsClassified.filter(c => c.id !== cardId);
                } else {
                    // Agregar a zona de drop
                    zone.appendChild(cardElement);
                    
                    const cardType = cardElement.dataset.cardType;
                    const zoneType = zone.dataset.type;
                    
                    // Actualizar o agregar clasificación
                    const existingIndex = gameState.cardsClassified.findIndex(c => c.id === cardId);
                    const classification = {
                        id: cardId,
                        name: cardElement.dataset.cardName,
                        expected: cardType,
                        classified: zoneType,
                        correct: cardType === zoneType
                    };
                    
                    if (existingIndex >= 0) {
                        gameState.cardsClassified[existingIndex] = classification;
                    } else {
                        gameState.cardsClassified.push(classification);
                    }
                }
                
                updateGameScore();
            }
        });
    });
}

function dragStart(event) {
    event.dataTransfer.setData('cardId', event.target.dataset.cardId);
    event.target.style.opacity = '0.5';
    gameState.draggedCard = event.target;
}

function dragEnd(event) {
    event.target.style.opacity = '1';
    gameState.draggedCard = null;
}

function createDynamicCardsForCity(city) {
    const cards = [];
    const mapByType = {
        MPD: ['material', 'insumo', 'materia prima', 'componente', 'directo'],
        MOD: ['mano de obra', 'operario', 'hora', 'ensamble', 'proceso'],
        CIF: ['cif', 'indirect', 'energía', 'depreciación', 'setup', 'inspección', 'mantenimiento'],
        GA: ['admin', 'gerencia', 'oficina', 'contable', 'planeación'],
        GV: ['venta', 'comercial', 'marketing', 'despacho', 'cliente']
    };

    const pickType = (text) => {
        const t = String(text).toLowerCase();
        for (const [type, keys] of Object.entries(mapByType)) {
            if (keys.some(k => t.includes(k))) return type;
        }
        return 'CIF';
    };

    if (Array.isArray(city.puzzle)) {
        city.puzzle.forEach((q, i) => {
            const label = String(q.question || `Variable ${i + 1}`);
            cards.push({
                name: `Dato crítico ${i + 1}: ${label.slice(0, 42)}${label.length > 42 ? '…' : ''}`,
                type: pickType(label),
                trap: false
            });
        });
    }

    if (Array.isArray(city.decisions)) {
        city.decisions.forEach((d, i) => {
            const label = String(d.text || `Decisión ${i + 1}`);
            cards.push({
                name: `Decisión ${i + 1}: ${label.slice(0, 44)}${label.length > 44 ? '…' : ''}`,
                type: pickType(label),
                trap: i === 2
            });
        });
    }

    if (cards.length < 10) {
        const fillers = [
            { name: 'Checklist de exactitud de cifras', type: 'GA', trap: false },
            { name: 'Horas de operación del proceso', type: 'MOD', trap: false },
            { name: 'Consumo técnico de insumos', type: 'MPD', trap: false },
            { name: 'Control de mantenimiento y energía', type: 'CIF', trap: false },
            { name: 'Estrategia de precio al cliente', type: 'GV', trap: false }
        ];
        while (cards.length < 10) cards.push(fillers[cards.length % fillers.length]);
    }

    return cards.slice(0, 16);
}

function checkClassification() {
    const city = cityData[gameState.currentCity];
    const totalCards = city.cards.length;
    const classified = gameState.cardsClassified.length;
    
    if (classified < totalCards) {
        showMessage(`⚠️ Aún faltan ${totalCards - classified} tarjetas por clasificar.<br>Arrastra todas las tarjetas a las bandejas.`);
        return;
    }
    
    let correct = 0;
    let trapsFound = 0;
    let feedback = [];
    
    gameState.cardsClassified.forEach(card => {
        if (card.correct) {
            correct++;
            gameState.score += 10;
            gameState.combo++;
            
            if (gameState.combo >= 5) {
                gameState.score += 30;
                showMessage("🔥 ¡COMBO PRECISIÓN! +30 puntos", "success");
                gameState.combo = 0;
            }
        } else {
            gameState.combo = 0;
            gameState.score -= 10;
            feedback.push(`❌ ${card.name}: esperaba ${card.expected}, clasificaste ${card.classified}`);
        }
        
        const cardData = city.cards.find(c => c.name === card.name);
        if (cardData && cardData.trap && card.correct) {
            trapsFound++;
            gameState.score += 20;
        }
    });
    
    const percentage = (correct / totalCards) * 100;
    gameState.correctAnswers = correct;
    
    // Update health based on performance
    if (percentage >= 85) {
        gameState.health = Math.min(100, gameState.health + 10);
        addCoins(3);
    } else if (percentage >= 70) {
        addCoins(2);
    } else {
        gameState.health = Math.max(0, gameState.health - 10);
    }
    
    updateHUD();
    updateGameScore();
    
    let message = `
        <div class="text-left">
            <strong class="text-2xl">✅ Clasificación Completa!</strong><br><br>
            <strong>Correctas:</strong> ${correct}/${totalCards} (${percentage.toFixed(1)}%)<br>
            <strong>Trampas encontradas:</strong> ${trapsFound}/2<br>
            <strong>Puntos ganados:</strong> ${gameState.score}<br>
    `;
    
    if (feedback.length > 0 && feedback.length <= 5) {
        message += `<br><strong class="text-yellow-300">Errores:</strong><br>${feedback.slice(0, 5).join('<br>')}`;
    }
    
    message += '</div>';
    
    showMessage(message, percentage >= 85 ? 'success' : 'warning', 5000);
    
    setTimeout(() => {
        startScene('explora');
    }, 5000);
}

function updateGameScore() {
    const scoreEl = document.getElementById('game-score');
    const comboEl = document.getElementById('game-combo');
    const correctEl = document.getElementById('game-correct');
    
    if (scoreEl) scoreEl.textContent = gameState.score;
    if (comboEl) comboEl.textContent = gameState.combo;
    if (correctEl) correctEl.textContent = `${gameState.correctAnswers}/${gameState.totalQuestions}`;
}

// Exploration Game
function initExploration() {
    const city = cityData[gameState.currentCity];
    gameState.zonesVisited = [];
    gameState.explorationData = {};
    renderExplorationZones(city);
    
    const dataCollected = document.getElementById('data-collected');
    const collectedList = document.getElementById('collected-list');
    
    if (dataCollected) dataCollected.classList.add('hidden');
    if (collectedList) collectedList.innerHTML = '';
    
    const btnContinue = document.getElementById('btn-continue-puzzle');
    if (btnContinue) {
        // Ya no se exige secuencia: el reto siempre está disponible.
        btnContinue.disabled = false;
        btnContinue.classList.remove('opacity-50', 'cursor-not-allowed');
        btnContinue.classList.remove('animate-pulse');
    }
    
    // Reset zone statuses
    Object.keys(city.zones).forEach(zoneKey => {
        const statusEl = document.getElementById(`${zoneKey}-status`);
        if (statusEl) {
            statusEl.textContent = 'No visitado';
            statusEl.className = 'bg-gray-700 px-2 py-1 rounded text-xs';
        }
    });
}

function renderExplorationZones(city) {
    const container = document.getElementById('exploration-zones');
    if (!container || !city || !city.zones) return;

    const styles = [
        { card: 'bg-blue-900/30 border-blue-500 hover:bg-blue-800/40', title: 'text-blue-300', badge: 'bg-blue-700' },
        { card: 'bg-orange-900/30 border-orange-500 hover:bg-orange-800/40', title: 'text-orange-300', badge: 'bg-orange-700' },
        { card: 'bg-green-900/30 border-green-500 hover:bg-green-800/40', title: 'text-green-300', badge: 'bg-green-700' },
        { card: 'bg-purple-900/30 border-purple-500 hover:bg-purple-800/40', title: 'text-purple-300', badge: 'bg-purple-700' }
    ];

    const zoneEntries = Object.entries(city.zones);
    container.innerHTML = zoneEntries.map(([zoneKey, zone], idx) => {
        const style = styles[idx % styles.length];
        const preview = (zone.data && zone.data[0]) ? zone.data[0] : 'Recolecta indicadores clave de gestión';
        return `
            <button onclick="exploreZone('${zoneKey}')" class="exploration-zone ${style.card} border-2 rounded-lg p-6 transition-all" data-zone="${zoneKey}">
                <div class="text-4xl mb-2">${zone.emoji || '📍'}</div>
                <div class="font-bold ${style.title} mb-2">${(zone.name || zoneKey).toUpperCase()}</div>
                <div class="text-sm text-gray-300">${preview}</div>
                <div class="mt-3 text-xs">
                    <span class="${style.badge} px-2 py-1 rounded" id="${zoneKey}-status">No visitado</span>
                </div>
            </button>
        `;
    }).join('');
}

function exploreZone(zoneName) {
    if (gameState.zonesVisited.includes(zoneName)) {
        showMessage("✓ Ya visitaste esta zona", "info");
        return;
    }
    
    const city = cityData[gameState.currentCity];
    const zone = city.zones[zoneName];
    
    if (!zone) return;
    
    // Move COSTI
    const costiExplorer = document.getElementById('costi-explorer');
    const zonePositions = {
        bodega: '10%', almacen: '10%', requisiciones: '10%', materiales: '10%', actividades: '10%', estandares: '10%', productos: '10%',
        produccion: '45%', ventas: '45%', horas: '45%', proceso: '45%', productos2: '45%', reales: '45%', restriccion: '45%',
        calidad: '80%', control: '80%', verificacion: '80%', conversion: '80%', drivers: '80%', analisis: '80%', demanda: '80%'
    };
    
    if (costiExplorer) {
        costiExplorer.style.left = zonePositions[zoneName] || '45%';
    }
    
    // Mark as visited
    gameState.zonesVisited.push(zoneName);
    gameState.explorationData[zoneName] = zone.data;
    
    const statusEl = document.getElementById(`${zoneName}-status`);
    if (statusEl) {
        statusEl.textContent = '✓ Visitado';
        statusEl.className = 'bg-green-700 px-2 py-1 rounded text-xs';
    }
    
    // Show collected data
    const dataCollected = document.getElementById('data-collected');
    const collectedList = document.getElementById('collected-list');
    
    if (dataCollected && collectedList) {
        dataCollected.classList.remove('hidden');
        
        zone.data.forEach(item => {
            const div = document.createElement('div');
            div.className = 'text-gray-300 text-sm';
            div.innerHTML = `<span class="text-green-400">✓</span> <strong>${zone.name}:</strong> ${item}`;
            collectedList.appendChild(div);
        });
    }
    
    addCoins(1);
    gameState.score += 15;
    updateHUD();
    
    showMessage(`📍 Zona explorada: <strong>${zone.name}</strong><br>+15 puntos, +1 COSTOCOIN`, "success");
    
    // Bonus opcional por exploración completa (NO bloquea el avance)
    const totalZones = Object.keys(city.zones).length;
    if (gameState.zonesVisited.length === totalZones) {
        gameState.score += 30;
        addCoins(2);
        updateHUD();
        showMessage("🏁 Exploración completa: +30 puntos y +2 COSTOCOINS.", "success", 3500);
    }
}

// Puzzle Game (ARCADE)
function initPuzzle() {
    const city = cityData[gameState.currentCity];
    const puzzleQuestions = document.getElementById('puzzle-questions');
    const auditZone = document.getElementById('audit-zone');

    if (!puzzleQuestions) return;

    // Si la ciudad está configurada como reto profesional (gameType), usar CaseLab (sin sliders).
    if (city && city.gameType) {
        initProfessionalPuzzle(city);
        return;
    }

    // Estado del arcade
    gameState.arcade = {
        stage: 'panel',
        timer: null,
        timeLeft: 60,
        streak: 0,
        locked: 0,
        correct: 0,
        total: city.puzzle.length,
        panel: [],
        audit: {
            active: false,
            timer: null,
            timeLeft: 18,
            flags: [],
            found: 0,
            wrong: 0
        }
    };

    // HUD base
    const totalEl = document.getElementById('arcade-total');
    if (totalEl) totalEl.textContent = String(gameState.arcade.total);

    if (auditZone) auditZone.classList.add('hidden');

    renderArcadePanel(city);
    startArcadeStage('panel', 60);

    const decisionPanel = document.getElementById('decision-panel');
    const levelResults = document.getElementById('level-results');
    if (decisionPanel) decisionPanel.classList.add('hidden');
    if (levelResults) levelResults.classList.add('hidden');
}

function renderArcadePanel(city) {
    const container = document.getElementById('puzzle-questions');
    if (!container) return;

    // Prepara módulos
    gameState.arcade.panel = city.puzzle.map((q, index) => {
        const target = Number(q.answer);
        const absT = Math.abs(target);
        const tol = Math.max(absT * 0.02, 0.01);

        // Rango sugerido (dinámico)
        let min = 0;
        let max = Math.max(10, absT * 2.2);
        if (target < 0) {
            min = -max;
        }

        // Paso: si tiene decimales, 0.01; si no, 1
        const step = (String(target).includes('.') ? 0.01 : 1);

        // Valor inicial: cercano, pero no exacto
        const jitter = (absT > 1 ? absT * 0.18 : 1.2);
        const start = clamp(target + (randBetween(-jitter, jitter)), min, max);

        return {
            index,
            question: q.question,
            hint: q.hint,
            target,
            tol,
            min,
            max,
            step,
            value: start,
            locked: false,
            correct: false
        };
    });

    container.innerHTML = gameState.arcade.panel.map(m => `
        <div class=\"mb-4 bg-gray-800/50 rounded-lg p-4 border-2 border-gray-700\" id=\"module-${m.index}\">
            <div class=\"flex items-start justify-between gap-3\">
                <div class=\"text-white font-semibold\">
                    <span class=\"text-crimson-400\">${m.index + 1}.</span> ${m.question}
                </div>
                <div class=\"text-xl\" id=\"status-${m.index}\">⏳</div>
            </div>

            <div class=\"mt-3\">
                <div class=\"flex items-center gap-2\">
                    <button type=\"button\" class=\"bg-gray-700 hover:bg-gray-600 text-white font-bold px-3 py-2 rounded\" onclick=\"nudgeSlider(${m.index}, -1)\">−</button>
                    <input type=\"range\" id=\"slider-${m.index}\" min=\"${m.min}\" max=\"${m.max}\" step=\"${m.step}\" value=\"${m.value}\"
                        class=\"w-full\" oninput=\"updateSliderValue(${m.index})\">
                    <button type=\"button\" class=\"bg-gray-700 hover:bg-gray-600 text-white font-bold px-3 py-2 rounded\" onclick=\"nudgeSlider(${m.index}, 1)\">+</button>
                </div>

                <div class=\"flex items-center justify-between mt-3\">
                    <div class=\"text-sm text-gray-300\">Valor: <span class=\"font-extrabold text-white\" id=\"value-${m.index}\">${formatNum(m.value)}</span></div>
                    <button type=\"button\" class=\"bg-crimson-700 hover:bg-crimson-600 text-white font-bold py-2 px-4 rounded-lg\" onclick=\"lockAnswer(${m.index})\">🔒 Bloquear</button>
                </div>

                <div class=\"mt-2 text-xs text-gray-400\" id=\"hint-${m.index}\" style=\"display:none\">💡 ${m.hint}</div>
            </div>
        </div>
    `).join('');

    // Inicializa métricas para HUD/score
    gameState.correctAnswers = 0;
    gameState.totalQuestions = gameState.arcade.total;
    updateGameScore();
    updateArcadeHUD();

    const stageLabel = document.getElementById('arcade-stage-label');
    if (stageLabel) stageLabel.textContent = 'Ronda 1/2: Panel de Control (ajusta y bloquea tus resultados)';
}

function updateSliderValue(index) {
    const slider = document.getElementById(`slider-${index}`);
    const valueEl = document.getElementById(`value-${index}`);
    const moduleEl = document.getElementById(`module-${index}`);

    const m = gameState.arcade.panel.find(x => x.index === index);
    if (!slider || !m || m.locked) return;

    const v = Number(slider.value);
    m.value = v;
    if (valueEl) valueEl.textContent = formatNum(v);

    // Feedback visual (cerca del rango = verde suave)
    const close = Math.abs(v - m.target) <= (m.tol * 3);
    if (moduleEl) {
        moduleEl.classList.toggle('border-green-500', close);
        moduleEl.classList.toggle('border-gray-700', !close);
    }
}

function nudgeSlider(index, dir) {
    const m = gameState.arcade.panel.find(x => x.index === index);
    const slider = document.getElementById(`slider-${index}`);
    if (!m || !slider || m.locked) return;

    const step = Number(m.step);
    const next = clamp(Number(slider.value) + dir * step, Number(m.min), Number(m.max));
    slider.value = next;
    updateSliderValue(index);
}

function lockAnswer(index) {
    const m = gameState.arcade.panel.find(x => x.index === index);
    const moduleEl = document.getElementById(`module-${index}`);
    const statusEl = document.getElementById(`status-${index}`);
    const slider = document.getElementById(`slider-${index}`);

    if (!m || m.locked) return;

    const v = Number(slider ? slider.value : m.value);
    m.value = v;

    const isCorrect = Math.abs(v - m.target) <= m.tol;
    m.correct = isCorrect;
    m.locked = true;

    gameState.arcade.locked++;

    if (isCorrect) {
        gameState.arcade.correct++;
        gameState.arcade.streak++;
        gameState.correctAnswers = gameState.arcade.correct;

        // Puntos y combo
        const comboBonus = Math.min(25, gameState.arcade.streak * 3);
        gameState.score += 25 + comboBonus;

        if (statusEl) statusEl.textContent = '✅';
        if (moduleEl) {
            moduleEl.classList.add('border-green-500', 'bg-green-900/10');
            moduleEl.classList.remove('border-red-500');
        }

        // Micro-recompensa
        if (gameState.arcade.streak % 3 == 0) addCoins(1);

    } else {
        gameState.arcade.streak = 0;
        gameState.score -= 10;
        if (statusEl) statusEl.textContent = '❌';
        if (moduleEl) {
            moduleEl.classList.add('border-red-500', 'bg-red-900/10');
            moduleEl.classList.remove('border-green-500');
        }
    }

    // Bloquear slider
    if (slider) slider.disabled = true;

    updateArcadeHUD();
    updateHUD();
    updateGameScore();

    // Si completó panel, ir a auditoría
    if (gameState.arcade.locked >= gameState.arcade.total) {
        showMessage('🚀 Ronda 1 completada. ¡Prepárate para la auditoría rápida!', 'success', 2500);
        startAuditHunt(cityData[gameState.currentCity]);
    }
}

function startAuditHunt(city) {
    stopArcadeTimers();

    const auditZone = document.getElementById('audit-zone');
    const grid = document.getElementById('audit-grid');
    const stageLabel = document.getElementById('arcade-stage-label');

    if (stageLabel) stageLabel.textContent = 'Ronda 2/2: Caza de Banderas Rojas (clic rápido y preciso)';
    if (auditZone) auditZone.classList.remove('hidden');

    // Construye cartas (4 banderas rojas + 8 normales)
    const flags = buildAuditCards(city);
    gameState.arcade.stage = 'audit';
    gameState.arcade.audit.active = true;
    gameState.arcade.audit.flags = flags;
    gameState.arcade.audit.found = 0;
    gameState.arcade.audit.wrong = 0;

    if (grid) {
        grid.innerHTML = flags.map((c, idx) => `
            <button type=\"button\" onclick=\"auditPick(${idx})\" id=\"audit-${idx}\"
                class=\"bg-gray-900/60 hover:bg-gray-800 text-white rounded-lg p-3 border border-gray-700 text-left transition-all\">
                <div class=\"text-sm font-bold\">${c.icon} ${c.title}</div>
                <div class=\"text-xs text-gray-300 mt-1\">${c.desc}</div>
            </button>
        `).join('');
    }

    // Timer auditoría
    startArcadeStage('audit', 18);
}

function buildAuditCards(city) {
    const byCity = {
        1: [
            { title: 'Salida sin requisición', desc: 'Material salió de bodega sin documento', red: true },
            { title: 'Factura de flete', desc: 'Costo de periodo (no inventariable)', red: true },
            { title: 'MP indirecta mal cargada', desc: 'Pegamento cargado como directo', red: true },
            { title: 'Horas administrativas', desc: 'No deben ir a producto', red: true },
        ],
        2: [
            { title: 'Merma no registrada', desc: 'Ajuste de inventario pendiente', red: true },
            { title: 'Lote vencido', desc: 'FEFO ignorado', red: true },
            { title: 'Precio inconsistente', desc: 'Compra fuera de rango', red: true },
            { title: 'Conteo cíclico omitido', desc: 'Diferencia de stock', red: true },
        ],
        3: [
            { title: 'MP sin OC', desc: 'Requisición no autorizada', red: true },
            { title: 'Time ticket incompleto', desc: 'Horas sin orden', red: true },
            { title: 'CIF mal aplicado', desc: 'Base incorrecta', red: true },
            { title: 'Devolución no registrada', desc: 'Afecta MPD', red: true },
        ],
        4: [
            { title: 'UEQ mal calculada', desc: 'Conversión ≠ Materiales', red: true },
            { title: 'WIP sin % avance', desc: 'No se estimó conversión', red: true },
            { title: 'Merma normal no separada', desc: 'Ajuste al costo', red: true },
            { title: 'Transferencia omitida', desc: 'Terminados no se movieron', red: true },
        ],
        5: [
            { title: 'Driver equivocado', desc: 'Setup asignado por horas', red: true },
            { title: 'Subsidio cruzado', desc: 'Producto A subsidia B', red: true },
            { title: 'Pool inflado', desc: 'Costo no relacionado', red: true },
            { title: 'Inspección doble', desc: 'Actividad duplicada', red: true },
        ],
        6: [
            { title: 'Tarifa estándar desactualizada', desc: 'MOD estándar no refleja contrato', red: true },
            { title: 'Precio MP fuera de estándar', desc: 'Compra sin negociación', red: true },
            { title: 'Eficiencia negativa', desc: 'Horas reales > estándar', red: true },
            { title: 'CIF fijo absorbido mal', desc: 'Base de capacidad incorrecta', red: true },
        ],
        boss: [
            { title: 'Mix ignora cuello de botella', desc: 'No maximiza contribución/HR', red: true },
            { title: 'Demanda mal leída', desc: 'Prioridad errónea', red: true },
            { title: 'Costo relevante confundido', desc: 'Fijos irrelevantes para decisión', red: true },
            { title: 'Capacidad subestimada', desc: 'Horas disponibles mal calculadas', red: true },
        ]
    };

    const redSet = byCity[gameState.currentCity] || byCity[1];

    const normal = [
        { title: 'OC aprobada', desc: 'Documentación completa', red: false },
        { title: 'Parte de producción', desc: 'Registro consistente', red: false },
        { title: 'Hoja de ruta', desc: 'Proceso estándar', red: false },
        { title: 'Factura correcta', desc: 'Soporte y autorización', red: false },
        { title: 'Acta de inspección', desc: 'Muestreo válido', red: false },
        { title: 'Kardex al día', desc: 'Movimientos registrados', red: false },
        { title: 'Reporte de scrap', desc: 'Merma controlada', red: false },
        { title: 'Setup registrado', desc: 'Driver coherente', red: false },
        { title: 'Transferencia WIP', desc: 'Flujo completo', red: false },
        { title: 'Checklist OK', desc: 'Sin hallazgos', red: false },
    ];

    // Selecciona 4 rojas y 8 normales (mezcla)
    const shuffle = (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    const reds = (redSet.length >= 4)
        ? redSet.slice(0, 4)
        : redSet.concat(redSet).slice(0, 4);

    const cards = reds.map(r => ({
        icon: '🚩',
        title: r.title,
        desc: r.desc,
        red: true
    }));

    const normalCopy = normal.slice();
    shuffle(normalCopy);

    normalCopy.slice(0, 8).forEach(n => {
        cards.push({
            icon: '📄',
            title: n.title,
            desc: n.desc,
            red: false
        });
    });

    shuffle(cards);
    return cards
}

function auditPick(idx) {
    const c = gameState.arcade.audit.flags[idx];
    const btn = document.getElementById(`audit-${idx}`);
    if (!c || !btn || btn.dataset.clicked === '1') return;
    btn.dataset.clicked = '1';

    if (c.red) {
        gameState.arcade.audit.found++;
        gameState.score += 12;
        gameState.merma = Math.max(0, gameState.merma - 0.2);
        btn.classList.add('border-green-500', 'bg-green-900/30');
        btn.classList.remove('border-gray-700');
        btn.innerHTML = `<div class=\"text-sm font-bold\">✅ ${c.title}</div><div class=\"text-xs text-gray-200 mt-1\">Hallazgo detectado</div>`;
    } else {
        gameState.arcade.audit.wrong++;
        gameState.score -= 8;
        gameState.health = Math.max(0, gameState.health - 2);
        btn.classList.add('border-red-500', 'bg-red-900/30');
        btn.classList.remove('border-gray-700');
        btn.innerHTML = `<div class=\"text-sm font-bold\">❌ ${c.title}</div><div class=\"text-xs text-gray-200 mt-1\">Falso positivo</div>`;
    }

    updateHUD();

    // Si encontró todas las rojas, termina antes
    const totalReds = gameState.arcade.audit.flags.filter(x => x.red).length;
    if (gameState.arcade.audit.found >= totalReds) {
        showMessage('🧠 ¡Auditoría perfecta! Bonus de precisión.', 'success', 2000);
        gameState.score += 20;
        addCoins(2);
        stopArcadeTimers();
        setTimeout(() => submitPuzzle(), 900);
    }
}


// ===============================
// CASELAB (Retos Profesionales)
// ===============================
function initProfessionalPuzzle(city) {
    const container = document.getElementById('puzzle-questions');
    const auditZone = document.getElementById('audit-zone');
    const titleEl = document.getElementById('puzzle-title');
    const subEl = document.getElementById('puzzle-subtitle');
    const stageLabel = document.getElementById('arcade-stage-label');

    if (!container) return;

    // UI base
    if (auditZone) auditZone.classList.add('hidden');

    if (titleEl) titleEl.textContent = city.objective || "Caso Aplicado";
    if (subEl) subEl.textContent = city.caseSubtitle || "Resuelve el caso, valida tus cálculos y toma una decisión gerencial.";
    if (stageLabel) stageLabel.textContent = city.caseStageLabel || "Caso aplicado: completa cálculos clave (con control de calidad) y cierra con una decisión.";

    // Estado CaseLab
    const timeLimit = city.caseTimeLimit || 240;
    gameState.caseLab = {
        type: city.gameType,
        timeLimit,
        timeLeft: timeLimit,
        timer: null,
        solved: {},
        attempts: 0,
        scoreLocal: 0,
        // payload específico por tipo
        data: null,
        answers: null,
        totalFields: 0,
        locked: false,
        postgrad: {
            questions: [],
            validated: false
        }
    };

    // Genera caso + respuestas esperadas
    if (city.gameType === "kardex-simulator") {
        const gen = generateKardexCase(city);
        gameState.caseLab.data = gen.data;
        gameState.caseLab.answers = gen.answers;
        renderKardexCase(container, gen.data);
    } else if (city.gameType === "job-order") {
        const gen = generateJobOrderCase(city);
        gameState.caseLab.data = gen.data;
        gameState.caseLab.answers = gen.answers;
        renderJobOrderCase(container, gen.data);
    } else if (city.gameType === "process-costing") {
        const gen = generateProcessCostingCase(city);
        gameState.caseLab.data = gen.data;
        gameState.caseLab.answers = gen.answers;
        renderProcessCostingCase(container, gen.data);
    } else if (city.gameType === "abc-costing") {
        const gen = generateABCCase(city);
        gameState.caseLab.data = gen.data;
        gameState.caseLab.answers = gen.answers;
        renderABCCase(container, gen.data);
    } else if (city.gameType === "standard-costing") {
        const gen = generateStandardCostingCase(city);
        gameState.caseLab.data = gen.data;
        gameState.caseLab.answers = gen.answers;
        renderStandardCostingCase(container, gen.data);
    } else {
        // fallback: usa arcade clásico
        renderArcadePanel(city);
        startArcadeStage('panel', 60);
        return;
    }

    // Capa posgrado: defensa técnica + criterio gerencial
    gameState.caseLab.postgrad.questions = buildPostgradQuestions(city, gameState.caseLab.data, gameState.caseLab.answers);
    renderPostgradChallenge(container, gameState.caseLab.postgrad.questions);
    gameState.caseLab.postgrad.questions.forEach((_, idx) => {
        gameState.caseLab.solved[`pg_${idx}`] = false;
    });

    // Inicializa HUD de progreso
    const totalEl = document.getElementById('arcade-total');
    const progressEl = document.getElementById('arcade-progress');
    const streakEl = document.getElementById('arcade-streak');
    const timeEl = document.getElementById('arcade-time');

    const technicalFields = Object.keys(gameState.caseLab.answers || {}).filter(k => !k.startsWith('_')).length;
    const postgradFields = (gameState.caseLab.postgrad?.questions || []).length;
    gameState.caseLab.totalFields = technicalFields + postgradFields;

    if (totalEl) totalEl.textContent = String(gameState.caseLab.totalFields);
    if (progressEl) progressEl.textContent = "0";
    if (streakEl) streakEl.textContent = "0";
    if (timeEl) timeEl.textContent = String(gameState.caseLab.timeLeft);

    startCaseTimer();
}

function buildPostgradQuestions(city, data, answers) {
    const byType = {
        'kardex-simulator': [
            { id: 'risk_method', q: 'Si esperas inflación de compras, ¿qué método tiende a mostrar mayor utilidad contable en el corto plazo?', options: ['FIFO/PEPS', 'Promedio ponderado', 'No cambia'], correct: 'FIFO/PEPS' },
            { id: 'control_merma', q: 'Para controlar merma anormal, ¿qué indicador gerencial es más accionable semanalmente?', options: ['Rotación por SKU + conteo cíclico', 'Solo utilidad neta mensual', 'Solo ventas brutas'], correct: 'Rotación por SKU + conteo cíclico' },
            { id: 'policy', q: '¿Qué política reduce riesgo de quiebre y capital inmovilizado simultáneamente?', options: ['Reabasto por punto de pedido con stock de seguridad dinámico', 'Comprar lotes máximos siempre', 'Eliminar control de inventario'], correct: 'Reabasto por punto de pedido con stock de seguridad dinámico' }
        ],
        'job-order': [
            { id: 'base', q: 'Cuando el overhead se explica por automatización, ¿qué base CIF es técnicamente preferible?', options: ['Horas MOD', 'Horas máquina', 'Unidades vendidas'], correct: 'Horas máquina' },
            { id: 'quote', q: 'Una cotización profesional debe incluir, además del costo unitario:', options: ['Riesgo de capacidad y sensibilidad de margen', 'Solo intuición comercial', 'Solo descuento inmediato'], correct: 'Riesgo de capacidad y sensibilidad de margen' },
            { id: 'traceability', q: '¿Qué mejora más la auditabilidad de órdenes?', options: ['Time tickets y requisiciones con trazabilidad por lote', 'Notas verbales sin registro', 'Promedios generales sin detalle'], correct: 'Time tickets y requisiciones con trazabilidad por lote' }
        ],
        'process-costing': [
            { id: 'ueq', q: 'En WA, el mayor riesgo técnico es:', options: ['Confundir % de materiales con % de conversión', 'Usar demasiados decimales', 'No usar colores'], correct: 'Confundir % de materiales con % de conversión' },
            { id: 'wip', q: 'Para reducir sesgo en WIP final, una práctica posgrado es:', options: ['Cierre con evidencia de avance físico por estación', 'Estimación visual sin evidencia', 'Ignorar WIP'], correct: 'Cierre con evidencia de avance físico por estación' },
            { id: 'kaizen', q: '¿Qué acción impacta más conversión en proceso continuo?', options: ['Reducir reprocesos de cuello de botella', 'Aumentar papelería', 'Subir inventario final'], correct: 'Reducir reprocesos de cuello de botella' }
        ],
        'abc-costing': [
            { id: 'driver', q: 'El criterio clave para seleccionar driver ABC es:', options: ['Causalidad costo-actividad', 'Facilidad estética', 'Preferencia del supervisor'], correct: 'Causalidad costo-actividad' },
            { id: 'mix', q: 'Si un producto consume más setups y menos volumen, normalmente:', options: ['Subcosteado en sistemas tradicionales', 'Siempre sobrecosteado', 'No cambia nunca'], correct: 'Subcosteado en sistemas tradicionales' },
            { id: 'decision', q: 'La decisión ejecutiva robusta tras ABC incluye:', options: ['Reprecio/selectividad + rediseño de procesos', 'Bajar precios a todos', 'Ignorar drivers'], correct: 'Reprecio/selectividad + rediseño de procesos' }
        ],
        'standard-costing': [
            { id: 'variance', q: 'Si MPV y MQV son desfavorables simultáneamente, una hipótesis fuerte es:', options: ['Problema proveedor + ineficiencia de uso', 'Éxito total del proceso', 'Solo error de redondeo'], correct: 'Problema proveedor + ineficiencia de uso' },
            { id: 'labor', q: 'Si tarifa MOD sube pero eficiencia mejora, el análisis correcto es:', options: ['Trade-off costo-calidad/experiencia', 'Todo es negativo', 'No analizar'], correct: 'Trade-off costo-calidad/experiencia' },
            { id: 'root', q: '¿Qué herramienta fortalece causa raíz de variaciones?', options: ['Ishikawa + 5 porqués con datos', 'Suposición sin datos', 'Eliminar estándares'], correct: 'Ishikawa + 5 porqués con datos' }
        ]
    };
    return byType[city.gameType] || [
        { id: 'generic_1', q: '¿Qué define un buen modelo de costos?', options: ['Exactitud + trazabilidad + utilidad decisional', 'Solo rapidez', 'Solo complejidad'], correct: 'Exactitud + trazabilidad + utilidad decisional' },
        { id: 'generic_2', q: '¿Qué mejora más la toma de decisiones?', options: ['Escenarios y sensibilidad', 'Adivinar', 'Eliminar KPIs'], correct: 'Escenarios y sensibilidad' }
    ];
}

function renderPostgradChallenge(container, questions) {
    if (!container || !Array.isArray(questions) || questions.length === 0) return;
    const panel = document.createElement('div');
    panel.id = 'postgrad-panel';
    panel.className = 'mt-6 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-xl p-4 border border-purple-500/40';
    panel.innerHTML = `
        <div class="flex items-center justify-between gap-2 mb-3">
            <div>
                <div class="text-lg font-extrabold text-purple-200">🎓 Defensa Ejecutiva (Posgrado)</div>
                <div class="text-xs text-gray-300">Responde criterios técnicos y gerenciales. Suma al puntaje de exactitud final.</div>
            </div>
            <div id="postgrad-score" class="text-sm bg-black/30 border border-purple-400/40 rounded px-3 py-1">0/${questions.length}</div>
        </div>
        <div class="space-y-3" id="postgrad-questions">
            ${questions.map((item, idx) => `
                <div class="bg-black/25 rounded-lg p-3 border border-gray-700">
                    <div class="text-sm text-gray-100 font-semibold mb-2">${idx + 1}) ${item.q}</div>
                    <select id="pg_${idx}" class="w-full bg-black/40 border border-gray-700 rounded px-3 py-2 text-white">
                        <option value="">Selecciona respuesta</option>
                        ${item.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                </div>
            `).join('')}
        </div>
        <div class="mt-3 flex gap-2">
            <button onclick="validatePostgradChallenge()" class="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">Validar defensa</button>
            <button onclick="resetPostgradChallenge()" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Reset defensa</button>
        </div>
        <div id="postgrad-feedback" class="mt-2 text-sm text-gray-300"></div>
    `;
    container.appendChild(panel);
}

function validatePostgradChallenge() {
    const c = gameState.caseLab;
    if (!c || !c.postgrad || !Array.isArray(c.postgrad.questions)) return;

    let correct = 0;
    c.postgrad.questions.forEach((q, idx) => {
        const v = document.getElementById(`pg_${idx}`)?.value || '';
        const ok = v === q.correct;
        c.solved[`pg_${idx}`] = ok;
        if (ok) correct++;
    });
    c.postgrad.validated = true;
    c.scoreLocal = Object.values(c.solved).filter(Boolean).length;
    updateCaseProgress();

    const score = document.getElementById('postgrad-score');
    if (score) score.textContent = `${correct}/${c.postgrad.questions.length}`;

    const fb = document.getElementById('postgrad-feedback');
    if (fb) {
        fb.innerHTML = correct >= Math.ceil(c.postgrad.questions.length * 0.67)
            ? '<span class="text-green-300">Excelente defensa técnica: criterio gerencial sólido.</span>'
            : '<span class="text-yellow-300">Defensa parcial: revisa causalidad, control y decisión ejecutiva.</span>';
    }

    showMessage(correct >= 2 ? '🎓 Defensa ejecutiva aprobada.' : '⚠️ Defensa ejecutiva débil: mejora el argumento técnico.', correct >= 2 ? 'success' : 'warning', 2400);
}

function resetPostgradChallenge() {
    const c = gameState.caseLab;
    if (!c || !c.postgrad) return;
    c.postgrad.questions.forEach((_, idx) => {
        const el = document.getElementById(`pg_${idx}`);
        if (el) el.value = '';
        c.solved[`pg_${idx}`] = false;
    });
    c.postgrad.validated = false;
    c.scoreLocal = Object.values(c.solved).filter(Boolean).length;
    updateCaseProgress();
    const score = document.getElementById('postgrad-score');
    if (score) score.textContent = `0/${c.postgrad.questions.length}`;
    const fb = document.getElementById('postgrad-feedback');
    if (fb) fb.textContent = '';
}

function startCaseTimer() {
    stopCaseTimer();
    const timeEl = document.getElementById('arcade-time');
    gameState.caseLab.timer = setInterval(() => {
        if (!gameState.caseLab || gameState.caseLab.locked) return;
        gameState.caseLab.timeLeft = Math.max(0, (gameState.caseLab.timeLeft || 0) - 1);
        if (timeEl) timeEl.textContent = String(gameState.caseLab.timeLeft);
        if (gameState.caseLab.timeLeft <= 0) {
            stopCaseTimer();
            showMessage("⏳ Tiempo agotado. Se evaluará lo que esté validado.", "warning", 2600);
            // auto-evaluación (sin forzar)
            finalizeProfessionalCase({ timeout: true });
        }
    }, 1000);
}

function stopCaseTimer() {
    if (gameState.caseLab && gameState.caseLab.timer) {
        clearInterval(gameState.caseLab.timer);
        gameState.caseLab.timer = null;
    }
}

function updateCaseProgress() {
    const progressEl = document.getElementById('arcade-progress');
    const streakEl = document.getElementById('arcade-streak');
    const solvedCount = Object.values(gameState.caseLab.solved || {}).filter(Boolean).length;
    if (progressEl) progressEl.textContent = String(solvedCount);
    if (streakEl) streakEl.textContent = String(gameState.caseLab.scoreLocal || 0);
}

function num(v) {
    const x = Number(v);
    return Number.isFinite(x) ? x : NaN;
}

function money(n) {
    const x = Number(n);
    if (!Number.isFinite(x)) return "—";
    return `$${x.toFixed(2)}`;
}

function withinTol(actual, expected) {
    const a = Number(actual);
    const e = Number(expected);
    if (!Number.isFinite(a) || !Number.isFinite(e)) return false;
    const tol = Math.max(Math.abs(e) * 0.01, 0.02); // 1% o 2 centavos
    return Math.abs(a - e) <= tol;
}

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max, decimals=2) {
    const x = Math.random() * (max - min) + min;
    const p = Math.pow(10, decimals);
    return Math.round(x * p) / p;
}

// ---------- CITY 2: Kardex Pro ----------
function generateKardexCase(city) {
    // Genera 4 compras + 2 ventas + merma (unidades)
    const purchases = [
        { date: "02/01", units: randInt(80, 140), price: randFloat(4.8, 6.2, 2) },
        { date: "10/01", units: randInt(70, 150), price: randFloat(5.6, 7.0, 2) },
        { date: "19/01", units: randInt(60, 160), price: randFloat(6.2, 7.8, 2) },
        { date: "27/01", units: randInt(50, 140), price: randFloat(6.8, 8.6, 2) }
    ].sort((a,b)=>a.date.localeCompare(b.date));

    const totalUnits = purchases.reduce((s,p)=>s+p.units,0);
    const sale1 = randInt(120, Math.min(220, totalUnits-80));
    const sale2 = randInt(60, Math.min(180, totalUnits - sale1 - 40));
    const waste = randInt(6, 18);
    const unitsSold = sale1 + sale2;
    const sellPrice = randFloat(9.2, 12.5, 2);

    // FIFO calc
    const fifo = (()=>{
        let remaining = purchases.map(p=>({ ...p, left: p.units }));
        let cogs = 0;
        let need = unitsSold + waste; // unidades que salen del inventario
        for (const lot of remaining) {
            if (need<=0) break;
            const take = Math.min(lot.left, need);
            cogs += take * lot.price;
            lot.left -= take;
            need -= take;
        }
        const endUnits = remaining.reduce((s,l)=>s+l.left,0);
        const endVal = remaining.reduce((s,l)=>s+l.left*l.price,0);
        return { cogs, endUnits, endVal };
    })();

    // AVG calc
    const totalCost = purchases.reduce((s,p)=>s+p.units*p.price,0);
    const avgCost = totalCost / totalUnits;
    const avg = {
        cogs: (unitsSold + waste) * avgCost,
        endUnits: totalUnits - unitsSold - waste,
        endVal: (totalUnits - unitsSold - waste) * avgCost,
        avgCost
    };

    const revenue = unitsSold * sellPrice;
    const grossMarginFIFO = (revenue - fifo.cogs) / revenue * 100;
    const grossMarginAVG = (revenue - avg.cogs) / revenue * 100;

    // Objetivo de CU: costo unitario de ventas (sin incluir merma como unidades vendidas)
    const cuFIFO = fifo.cogs / unitsSold;
    const cuAVG = avg.cogs / unitsSold;

    const data = { purchases, sale1, sale2, waste, unitsSold, sellPrice, totalUnits };
    const answers = {
        fifo_cogs: round2(fifo.cogs),
        fifo_end: round2(fifo.endVal),
        avg_cogs: round2(avg.cogs),
        avg_end: round2(avg.endVal),
        method: null,
        // métricas derivadas (no pedimos ingresar, pero usamos)
        _meta: {
            revenue: round2(revenue),
            fifo_margin: round2(grossMarginFIFO),
            avg_margin: round2(grossMarginAVG),
            fifo_cu: round2(cuFIFO),
            avg_cu: round2(cuAVG),
            avg_cost: round2(avg.avgCost)
        }
    };

    // Método recomendado (cumple CU objetivo y margen meta; si empata, prioriza mayor margen)
    const cuObj = gameState.cu.objetivo;
    const mGoal = 28;
    const fifoPass = (answers._meta.fifo_cu <= cuObj) && (answers._meta.fifo_margin >= mGoal);
    const avgPass  = (answers._meta.avg_cu <= cuObj) && (answers._meta.avg_margin >= mGoal);
        const recommended = A.method;
    c.solved.method = (method === recommended);

    const totalCorrect = ok + (c.solved.method ? 1 : 0);
    // Puntaje local (no es racha, es "calidad" del caso)
    c.scoreLocal = totalCorrect;
    updateCaseProgress();

    const fb = document.getElementById('k_feedback');
    if (fb) {
        const parts = [];
        parts.push(`<div class="font-bold text-white">Validación</div>`);
        parts.push(`<div>Campos correctos: <strong>${totalCorrect}/5</strong> | Recomendación: ${c.solved.method ? "<span class='text-green-400 font-bold'>Correcta</span>" : "<span class='text-red-400 font-bold'>Incorrecta</span>"}</div>`);
        fb.innerHTML = parts.join('');
    }

    // Actualiza KPIs con el método elegido (si está elegido)
    if (method === "fifo" || method === "avg") {
        const isFIFO = method === "fifo";
        const revenue = meta.revenue;
        const cogs = isFIFO ? A.fifo_cogs : A.avg_cogs;
        const margin = (revenue - cogs) / revenue * 100;
        const cu = cogs / c.data.unitsSold;
        gameState.margen = clamp(margin, 0, 80);
        gameState.cu.actual = cu;
        updateHUD();
    }

    showMessage(ok >= 3 ? "✅ Cálculos consistentes. Ahora cierra con decisión gerencial." : "⚠️ Revisa cálculos: unidades, merma y método.", ok >= 3 ? "success" : "warning", 2600);
}

function resetCaseInputs() {
    // Limpia inputs visibles del caso actual
    const container = document.getElementById('puzzle-questions');
    if (!container) return;
    const inputs = container.querySelectorAll('input, select');
    inputs.forEach(el => {
        if (el.tagName.toLowerCase() === 'select') {
            el.value = "";
        } else {
            el.value = "";
        }
    });
    if (gameState.caseLab) {
        gameState.caseLab.solved = {};
        gameState.caseLab.scoreLocal = 0;
    }
    updateCaseProgress();
}

// ---------- CITY 3: Job Order ----------
function generateJobOrderCase(city) {
    const budgetOH = randInt(45000, 92000);
    const budgetDLH = randInt(9000, 16000);
    const budgetMH  = randInt(6000, 14000);
    const jobA = {
        units: randInt(120, 280),
        dm: randInt(9000, 19000),
        dlCost: randInt(7000, 16000),
        dlh: randInt(220, 520),
        mh: randInt(160, 480)
    };
    const jobB = {
        units: randInt(80, 220),
        dm: randInt(7000, 16000),
        dlCost: randInt(6000, 14000),
        dlh: randInt(180, 460),
        mh: randInt(140, 520)
    };

    // Información causal: overhead impulsado por MH (profesional)
    const chosenBase = "mh";
    const rate = budgetOH / budgetMH;
    const appliedA = jobA.mh * rate;
    const unitCostA = (jobA.dm + jobA.dlCost + appliedA) / jobA.units;

    // Precio objetivo: margen bruto 35% sobre ventas => Precio = Costo / (1-0.35)
    const priceA = unitCostA / (1 - 0.35);

    const data = { budgetOH, budgetDLH, budgetMH, jobA, jobB, targetMargin: 35 };
    const answers = {
        base: chosenBase,
        rate: round2(rate),
        appliedA: round2(appliedA),
        unitCostA: round2(unitCostA),
        priceA: round2(priceA)
    };
    return { data, answers };
}

function renderJobOrderCase(container, data) {
    container.innerHTML = `
        <div class="bg-black/30 rounded-xl p-5 border border-gray-800">
            <div class="text-sm text-gray-300 mb-3">
                <div class="font-bold text-white mb-1">Caso: Costeo por Órdenes y cotización (tasa predeterminada)</div>
                <div>Se requiere definir la base de aplicación de CIF más consistente con la <strong>causalidad</strong>. El análisis técnico indica que el CIF está dominado por uso de maquinaria.</div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div class="bg-gray-900/40 rounded-lg p-4 border border-gray-800">
                    <div class="font-bold text-gray-100 mb-2">Presupuesto CIF y bases</div>
                    <div class="text-sm text-gray-200">CIF presupuestado: <strong>${money(data.budgetOH)}</strong></div>
                    <div class="text-sm text-gray-200">Base estimada DLH: <strong>${data.budgetDLH}</strong> horas</div>
                    <div class="text-sm text-gray-200">Base estimada MH: <strong>${data.budgetMH}</strong> horas máquina</div>

                    <div class="mt-4 font-bold text-gray-100 mb-2">Orden A (producción)</div>
                    <div class="text-sm text-gray-200">Unidades: <strong>${data.jobA.units}</strong></div>
                    <div class="text-sm text-gray-200">Material directo (DM): <strong>${money(data.jobA.dm)}</strong></div>
                    <div class="text-sm text-gray-200">Mano de obra directa (DL): <strong>${money(data.jobA.dlCost)}</strong></div>
                    <div class="text-sm text-gray-200">DLH: <strong>${data.jobA.dlh}</strong> | MH: <strong>${data.jobA.mh}</strong></div>

                    <div class="mt-4 font-bold text-gray-100 mb-2">Orden B (control)</div>
                    <div class="text-sm text-gray-200">Unidades: <strong>${data.jobB.units}</strong></div>
                    <div class="text-sm text-gray-200">DM: <strong>${money(data.jobB.dm)}</strong></div>
                    <div class="text-sm text-gray-200">DL: <strong>${money(data.jobB.dlCost)}</strong></div>
                    <div class="text-sm text-gray-200">DLH: <strong>${data.jobB.dlh}</strong> | MH: <strong>${data.jobB.mh}</strong></div>
                </div>

                <div class="bg-gray-900/40 rounded-lg p-4 border border-gray-800">
                    <div class="font-bold text-gray-100 mb-2">Entregables (auditable)</div>
                    <div class="text-xs text-gray-400 mb-3">Completa los cálculos clave. Tolerancia ±1%.</div>

                    <div class="grid grid-cols-1 gap-3">
                        <div class="bg-black/30 border border-gray-800 rounded-lg p-3">
                            <div class="text-sm text-gray-200 font-bold mb-2">1) Selección de base de aplicación</div>
                            <select id="jo_base" class="w-full bg-black/40 border border-gray-700 rounded px-3 py-2 text-white">
                                <option value="">Seleccionar base</option>
                                <option value="dlh">DLH (horas MOD)</option>
                                <option value="mh">MH (horas máquina)</option>
                            </select>
                            <div class="text-xs text-gray-400 mt-2">Criterio: causalidad técnica (drivers físicos).</div>
                        </div>

                        <div class="grid grid-cols-3 gap-2 items-center">
                            <div class="text-gray-300 text-sm">2) Tasa CIF</div>
                            <input id="jo_rate" type="number" step="0.01" class="col-span-2 bg-black/40 border border-gray-700 rounded px-3 py-2 text-white" placeholder="0.00">
                        </div>
                        <div class="grid grid-cols-3 gap-2 items-center">
                            <div class="text-gray-300 text-sm">3) CIF aplicado (A)</div>
                            <input id="jo_appliedA" type="number" step="0.01" class="col-span-2 bg-black/40 border border-gray-700 rounded px-3 py-2 text-white" placeholder="0.00">
                        </div>
                        <div class="grid grid-cols-3 gap-2 items-center">
                            <div class="text-gray-300 text-sm">4) Costo unitario (A)</div>
                            <input id="jo_unitA" type="number" step="0.01" class="col-span-2 bg-black/40 border border-gray-700 rounded px-3 py-2 text-white" placeholder="0.00">
                        </div>
                        <div class="grid grid-cols-3 gap-2 items-center">
                            <div class="text-gray-300 text-sm">5) Precio (A) para margen ${data.targetMargin}%</div>
                            <input id="jo_priceA" type="number" step="0.01" class="col-span-2 bg-black/40 border border-gray-700 rounded px-3 py-2 text-white" placeholder="0.00">
                        </div>

                        <div class="flex gap-2 mt-2">
                            <button onclick="validateJobOrder()" class="flex-1 bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Validar</button>
                            <button onclick="resetCaseInputs()" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Reiniciar</button>
                        </div>

                        <div id="jo_feedback" class="text-sm text-gray-300 mt-2"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function validateJobOrder() {
    const c = gameState.caseLab;
    if (!c || c.type !== "job-order") return;
    c.attempts += 1;

    const A = c.answers;
    const base = document.getElementById('jo_base')?.value || "";
    const rate = num(document.getElementById('jo_rate')?.value);
    const appliedA = num(document.getElementById('jo_appliedA')?.value);
    const unitA = num(document.getElementById('jo_unitA')?.value);
    const priceA = num(document.getElementById('jo_priceA')?.value);

    c.solved.base = (base === A.base);
    c.solved.rate = withinTol(rate, A.rate);
    c.solved.appliedA = withinTol(appliedA, A.appliedA);
    c.solved.unitCostA = withinTol(unitA, A.unitCostA);
    c.solved.priceA = withinTol(priceA, A.priceA);

    // Puntaje local
    c.scoreLocal = Object.values(c.solved).filter(Boolean).length;
    updateCaseProgress();

    // KPIs: CU = costo unitario A; margen según precio ingresado (si válido)
    if (Number.isFinite(unitA)) gameState.cu.actual = unitA;
    if (Number.isFinite(priceA) && Number.isFinite(unitA) && priceA > 0) {
        gameState.margen = clamp(((priceA - unitA) / priceA) * 100, 0, 80);
    }
    updateHUD();

    const fb = document.getElementById('jo_feedback');
    if (fb) {
        fb.innerHTML = `<div class="font-bold text-white">Validación</div>
                        <div>Campos correctos: <strong>${c.scoreLocal}/5</strong></div>
                        <div class="text-xs text-gray-400 mt-1">Tip profesional: base correcta = driver dominante del CIF.</div>`;
    }

    showMessage(c.scoreLocal >= 4 ? "✅ Cotización técnicamente consistente." : "⚠️ Revisa: base, tasa y aplicación de CIF.", c.scoreLocal >= 4 ? "success" : "warning", 2400);
}

// ---------- CITY 4: Process Costing (WA) ----------
function generateProcessCostingCase(city) {
    const bwipUnits = randInt(400, 900);
    const bwipMat = randInt(40, 80);   // %
    const bwipConv = randInt(20, 60);  // %

    const started = randInt(1200, 2400);
    const completed = randInt(1100, 2200);

    // ending WIP = bwip + started - completed
    const ewipUnits = bwipUnits + started - completed;

    const ewipMat = randInt(50, 95);
    const ewipConv = randInt(20, 70);

    const bwipCostMat = randInt(6000, 18000);
    const bwipCostConv = randInt(5000, 16000);
    const addedMat = randInt(15000, 42000);
    const addedConv = randInt(14000, 40000);

    // Weighted average equivalent units
    const euMat = completed + ewipUnits * (ewipMat/100);
    const euConv = completed + ewipUnits * (ewipConv/100);

    const costPerMat = (bwipCostMat + addedMat) / euMat;
    const costPerConv = (bwipCostConv + addedConv) / euConv;

    const costEWIP = (ewipUnits*(ewipMat/100))*costPerMat + (ewipUnits*(ewipConv/100))*costPerConv;

    const data = {
        bwipUnits, bwipMat, bwipConv,
        started, completed, ewipUnits, ewipMat, ewipConv,
        bwipCostMat, bwipCostConv, addedMat, addedConv
    };
    const answers = {
        euMat: round2(euMat),
        euConv: round2(euConv),
        cpm: round4(costPerMat),
        cpc: round4(costPerConv),
        ewipCost: round2(costEWIP)
    };
    return { data, answers };
}

function renderProcessCostingCase(container, data) {
    container.innerHTML = `
        <div class="bg-black/30 rounded-xl p-5 border border-gray-800">
            <div class="text-sm text-gray-300 mb-3">
                <div class="font-bold text-white mb-1">Caso: Costeo por procesos (Unidades equivalentes – Promedio Ponderado)</div>
                <div>Calcula unidades equivalentes de <strong>Materiales</strong> y <strong>Conversión</strong>, determina costos por EU y asigna costo a Inventario Final en Proceso (EWIP).</div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div class="bg-gray-900/40 rounded-lg p-4 border border-gray-800">
                    <div class="font-bold text-gray-100 mb-2">Datos de producción</div>
                    <div class="text-sm text-gray-200">BWIP: <strong>${data.bwipUnits}</strong> u | Mat: <strong>${data.bwipMat}%</strong> | Conv: <strong>${data.bwipConv}%</strong></div>
                    <div class="text-sm text-gray-200">Iniciadas: <strong>${data.started}</strong> u</div>
                    <div class="text-sm text-gray-200">Completadas y transferidas: <strong>${data.completed}</strong> u</div>
                    <div class="text-sm text-gray-200">EWIP: <strong>${data.ewipUnits}</strong> u | Mat: <strong>${data.ewipMat}%</strong> | Conv: <strong>${data.ewipConv}%</strong></div>

                    <div class="mt-4 font-bold text-gray-100 mb-2">Costos</div>
                    <div class="text-sm text-gray-200">BWIP – Materiales: <strong>${money(data.bwipCostMat)}</strong></div>
                    <div class="text-sm text-gray-200">BWIP – Conversión: <strong>${money(data.bwipCostConv)}</strong></div>
                    <div class="text-sm text-gray-200">Agregados – Materiales: <strong>${money(data.addedMat)}</strong></div>
                    <div class="text-sm text-gray-200">Agregados – Conversión: <strong>${money(data.addedConv)}</strong></div>
                </div>

                <div class="bg-gray-900/40 rounded-lg p-4 border border-gray-800">
                    <div class="font-bold text-gray-100 mb-2">Entregables (auditable)</div>
                    <div class="text-xs text-gray-400 mb-3">Ingresa EU y costos por EU (4 decimales). Tolerancia ±1%.</div>

                    <div class="grid grid-cols-1 gap-3">
                        <div class="grid grid-cols-3 gap-2 items-center">
                            <div class="text-gray-300 text-sm">1) EU Materiales</div>
                            <input id="pc_euMat" type="number" step="0.01" class="col-span-2 bg-black/40 border border-gray-700 rounded px-3 py-2 text-white">
                        </div>
                        <div class="grid grid-cols-3 gap-2 items-center">
                            <div class="text-gray-300 text-sm">2) EU Conversión</div>
                            <input id="pc_euConv" type="number" step="0.01" class="col-span-2 bg-black/40 border border-gray-700 rounded px-3 py-2 text-white">
                        </div>
                        <div class="grid grid-cols-3 gap-2 items-center">
                            <div class="text-gray-300 text-sm">3) Costo/EU Mat</div>
                            <input id="pc_cpm" type="number" step="0.0001" class="col-span-2 bg-black/40 border border-gray-700 rounded px-3 py-2 text-white">
                        </div>
                        <div class="grid grid-cols-3 gap-2 items-center">
                            <div class="text-gray-300 text-sm">4) Costo/EU Conv</div>
                            <input id="pc_cpc" type="number" step="0.0001" class="col-span-2 bg-black/40 border border-gray-700 rounded px-3 py-2 text-white">
                        </div>
                        <div class="grid grid-cols-3 gap-2 items-center">
                            <div class="text-gray-300 text-sm">5) Costo EWIP</div>
                            <input id="pc_ewip" type="number" step="0.01" class="col-span-2 bg-black/40 border border-gray-700 rounded px-3 py-2 text-white">
                        </div>

                        <div class="flex gap-2 mt-2">
                            <button onclick="validateProcessCosting()" class="flex-1 bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Validar</button>
                            <button onclick="resetCaseInputs()" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Reiniciar</button>
                        </div>
                        <div id="pc_feedback" class="text-sm text-gray-300 mt-2"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function validateProcessCosting() {
    const c = gameState.caseLab;
    if (!c || c.type !== "process-costing") return;
    c.attempts += 1;

    const A = c.answers;
    const euMat = num(document.getElementById('pc_euMat')?.value);
    const euConv = num(document.getElementById('pc_euConv')?.value);
    const cpm = num(document.getElementById('pc_cpm')?.value);
    const cpc = num(document.getElementById('pc_cpc')?.value);
    const ewip = num(document.getElementById('pc_ewip')?.value);

    c.solved.euMat = withinTol(euMat, A.euMat);
    c.solved.euConv = withinTol(euConv, A.euConv);
    c.solved.cpm = withinTol(cpm, A.cpm);
    c.solved.cpc = withinTol(cpc, A.cpc);
    c.solved.ewip = withinTol(ewip, A.ewipCost);

    c.scoreLocal = Object.values(c.solved).filter(Boolean).length;
    updateCaseProgress();

    // KPI: CU aproximado (costo total / completadas)
    const d = c.data;
    const totalCost = d.bwipCostMat + d.bwipCostConv + d.addedMat + d.addedConv;
    gameState.cu.actual = totalCost / d.completed;
    updateHUD();

    const fb = document.getElementById('pc_feedback');
    if (fb) fb.innerHTML = `<div class="font-bold text-white">Validación</div><div>Campos correctos: <strong>${c.scoreLocal}/5</strong></div>`;

    showMessage(c.scoreLocal >= 4 ? "✅ EU y asignación consistentes." : "⚠️ Revisa porcentajes de avance y método WA.", c.scoreLocal >= 4 ? "success" : "warning", 2400);
}

// ---------- CITY 5: ABC ----------
function generateABCCase(city) {
    const pools = [
        { name: "Setups", cost: randInt(28000, 72000), driver: "N° setups", totalDriver: randInt(120, 260) },
        { name: "Inspección", cost: randInt(20000, 62000), driver: "Horas insp.", totalDriver: randInt(800, 2200) },
        { name: "Manejo materiales", cost: randInt(18000, 58000), driver: "Movimientos", totalDriver: randInt(900, 2600) }
    ];
    const prodA = {
        name: "Producto A",
        units: randInt(900, 2200),
        dmPerUnit: randFloat(4.2, 6.5, 2),
        dlPerUnit: randFloat(2.2, 4.4, 2),
        drivers: {
            setups: randInt(30, 120),
            insp: randInt(180, 780),
            moves: randInt(240, 980)
        },
        price: randFloat(15.5, 22.0, 2)
    };
    const prodB = {
        name: "Producto B",
        units: randInt(600, 1800),
        dmPerUnit: randFloat(5.0, 8.0, 2),
        dlPerUnit: randFloat(2.8, 5.2, 2),
        drivers: {
            setups: randInt(40, 140),
            insp: randInt(240, 980),
            moves: randInt(320, 1200)
        },
        price: randFloat(18.0, 28.0, 2)
    };

    // rates
    const rateSetups = pools[0].cost / pools[0].totalDriver;
    const rateInsp = pools[1].cost / pools[1].totalDriver;
    const rateMoves = pools[2].cost / pools[2].totalDriver;

    const ohB = prodB.drivers.setups*rateSetups + prodB.drivers.insp*rateInsp + prodB.drivers.moves*rateMoves;
    const unitCostB = prodB.dmPerUnit + prodB.dlPerUnit + (ohB / prodB.units);
    const marginB = (prodB.price - unitCostB) / prodB.price * 100;

    const data = { pools, prodA, prodB };
    const answers = {
        rateSetups: round4(rateSetups),
        rateInsp: round4(rateInsp),
        ohB: round2(ohB),
        unitCostB: round2(unitCostB),
        decision: (marginB >= 20 ? "mantener" : (marginB >= 10 ? "reprecio" : "redisenar"))
    };
    return { data, answers };
}

function renderABCCase(container, data) {
    const poolRows = data.pools.map((p, idx) => `
        <tr class="border-b border-gray-800">
            <td class="py-2 px-2 text-gray-200">${p.name}</td>
            <td class="py-2 px-2 text-right text-gray-200">${money(p.cost)}</td>
            <td class="py-2 px-2 text-right text-gray-200">${p.totalDriver}</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="bg-black/30 rounded-xl p-5 border border-gray-800">
            <div class="text-sm text-gray-300 mb-3">
                <div class="font-bold text-white mb-1">Caso: ABC y rentabilidad por producto</div>
                <div>Determina tasas de cost drivers y asigna CIF a productos. Evalúa rentabilidad para una recomendación gerencial.</div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div class="bg-gray-900/40 rounded-lg p-4 border border-gray-800">
                    <div class="font-bold text-gray-100 mb-2">Pools de costos (CIF)</div>
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="text-gray-400 border-b border-gray-800">
                                <th class="text-left py-2 px-2">Pool</th>
                                <th class="text-right py-2 px-2">Costo</th>
                                <th class="text-right py-2 px-2">Driver total</th>
                            </tr>
                        </thead>
                        <tbody>${poolRows}</tbody>
                    </table>

                    <div class="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-200">
                        <div class="font-bold text-gray-100">${data.prodB.name} (focus)</div>
                        <div>Unidades: <strong>${data.prodB.units}</strong> | Precio/u: <strong>${money(data.prodB.price)}</strong></div>
                        <div>DM/u: <strong>${money(data.prodB.dmPerUnit)}</strong> | DL/u: <strong>${money(data.prodB.dlPerUnit)}</strong></div>
                        <div>Drivers (B): setups <strong>${data.prodB.drivers.setups}</strong>, insp <strong>${data.prodB.drivers.insp}</strong>, moves <strong>${data.prodB.drivers.moves}</strong></div>
                    </div>
                </div>

                <div class="bg-gray-900/40 rounded-lg p-4 border border-gray-800">
                    <div class="font-bold text-gray-100 mb-2">Entregables (auditable)</div>
                    <div class="text-xs text-gray-400 mb-3">Tasas en 4 decimales. Tolerancia ±1%.</div>

                    <div class="grid grid-cols-1 gap-3">
                        <div class="grid grid-cols-3 gap-2 items-center">
                            <div class="text-gray-300 text-sm">1) Tasa setups</div>
                            <input id="abc_rset" type="number" step="0.0001" class="col-span-2 bg-black/40 border border-gray-700 rounded px-3 py-2 text-white">
                        </div>
                        <div class="grid grid-cols-3 gap-2 items-center">
                            <div class="text-gray-300 text-sm">2) Tasa inspección</div>
                            <input id="abc_rinsp" type="number" step="0.0001" class="col-span-2 bg-black/40 border border-gray-700 rounded px-3 py-2 text-white">
                        </div>
                        <div class="grid grid-cols-3 gap-2 items-center">
                            <div class="text-gray-300 text-sm">3) CIF asignado a B</div>
                            <input id="abc_ohB" type="number" step="0.01" class="col-span-2 bg-black/40 border border-gray-700 rounded px-3 py-2 text-white">
                        </div>
                        <div class="grid grid-cols-3 gap-2 items-center">
                            <div class="text-gray-300 text-sm">4) Costo unitario B</div>
                            <input id="abc_ucB" type="number" step="0.01" class="col-span-2 bg-black/40 border border-gray-700 rounded px-3 py-2 text-white">
                        </div>

                        <div class="bg-black/30 border border-gray-800 rounded-lg p-3">
                            <div class="text-sm text-gray-200 font-bold mb-2">5) Recomendación (B)</div>
                            <select id="abc_decision" class="w-full bg-black/40 border border-gray-700 rounded px-3 py-2 text-white">
                                <option value="">Seleccionar</option>
                                <option value="mantener">Mantener (rentabilidad adecuada)</option>
                                <option value="reprecio">Ajustar precio / mix</option>
                                <option value="redisenar">Rediseñar proceso / driver reduction</option>
                            </select>
                            <div class="text-xs text-gray-400 mt-2">Criterio guía: margen bruto objetivo ≥ 20%.</div>
                        </div>

                        <div class="flex gap-2 mt-2">
                            <button onclick="validateABC()" class="flex-1 bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Validar</button>
                            <button onclick="resetCaseInputs()" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Reiniciar</button>
                        </div>
                        <div id="abc_feedback" class="text-sm text-gray-300 mt-2"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function validateABC() {
    const c = gameState.caseLab;
    if (!c || c.type !== "abc-costing") return;
    c.attempts += 1;

    const A = c.answers;
    const rset = num(document.getElementById('abc_rset')?.value);
    const rinsp = num(document.getElementById('abc_rinsp')?.value);
    const ohB = num(document.getElementById('abc_ohB')?.value);
    const ucB = num(document.getElementById('abc_ucB')?.value);
    const decision = document.getElementById('abc_decision')?.value || "";

    c.solved.rateSetups = withinTol(rset, A.rateSetups);
    c.solved.rateInsp = withinTol(rinsp, A.rateInsp);
    c.solved.ohB = withinTol(ohB, A.ohB);
    c.solved.unitCostB = withinTol(ucB, A.unitCostB);
    c.solved.decision = (decision === A.decision);

    c.scoreLocal = Object.values(c.solved).filter(Boolean).length;
    updateCaseProgress();

    // KPI: CU = costo unitario B; margen con precio B
    const d = c.data;
    if (Number.isFinite(ucB)) gameState.cu.actual = ucB;
    if (Number.isFinite(ucB)) gameState.margen = clamp(((d.prodB.price - ucB)/d.prodB.price)*100, 0, 80);
    updateHUD();

    const fb = document.getElementById('abc_feedback');
    if (fb) fb.innerHTML = `<div class="font-bold text-white">Validación</div><div>Campos correctos: <strong>${c.scoreLocal}/5</strong></div>`;

    showMessage(c.scoreLocal >= 4 ? "✅ ABC consistente. Recomendación defendible." : "⚠️ Verifica tasas y asignación de drivers.", c.scoreLocal >= 4 ? "success" : "warning", 2400);
}

// ---------- CITY 6: Standard Costing ----------
function generateStandardCostingCase(city) {
    const output = randInt(800, 1800);

    // Materials
    const stdQtyPerUnit = randFloat(1.6, 2.6, 2);
    const stdPrice = randFloat(2.4, 3.8, 2);
    const stdQty = output * stdQtyPerUnit;

    const actualQty = stdQty * randFloat(1.02, 1.18, 2);
    const actualPrice = stdPrice * randFloat(0.92, 1.15, 2);

    // Labor
    const stdHoursPerUnit = randFloat(0.35, 0.75, 2);
    const stdRate = randFloat(5.8, 9.5, 2);
    const stdHours = output * stdHoursPerUnit;

    const actualHours = stdHours * randFloat(0.95, 1.22, 2);
    const actualRate = stdRate * randFloat(0.92, 1.18, 2);

    const mpv = actualQty * (actualPrice - stdPrice);
    const mqv = stdPrice * (actualQty - stdQty);
    const lrv = actualHours * (actualRate - stdRate);
    const lev = stdRate * (actualHours - stdHours);

    const data = { output, stdQtyPerUnit, stdPrice, actualQty, actualPrice, stdHoursPerUnit, stdRate, actualHours, actualRate, stdQty, stdHours };
    const answers = {
        mpv: round2(mpv),
        mqv: round2(mqv),
        lrv: round2(lrv),
        lev: round2(lev),
        driver: (Math.abs(mpv)+Math.abs(lrv) >= Math.abs(mqv)+Math.abs(lev) ? "precio" : "eficiencia")
    };
    return { data, answers };
}

function renderStandardCostingCase(container, data) {
    container.innerHTML = `
        <div class="bg-black/30 rounded-xl p-5 border border-gray-800">
            <div class="text-sm text-gray-300 mb-3">
                <div class="font-bold text-white mb-1">Caso: Costos estándar y análisis de variaciones</div>
                <div>Calcula variaciones de MP y MOD. Reporta signo (F/U) y determina el driver dominante (precio/tarifa vs eficiencia/uso).</div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div class="bg-gray-900/40 rounded-lg p-4 border border-gray-800">
                    <div class="font-bold text-gray-100 mb-2">Datos (output y estándares)</div>
                    <div class="text-sm text-gray-200">Producción real: <strong>${data.output}</strong> u</div>

                    <div class="mt-4 font-bold text-gray-100 mb-2">Material Directo (MP)</div>
                    <div class="text-sm text-gray-200">SP: <strong>${money(data.stdPrice)}</strong> | SQ/u: <strong>${data.stdQtyPerUnit}</strong></div>
                    <div class="text-sm text-gray-200">AQ total: <strong>${data.actualQty.toFixed(2)}</strong> | AP: <strong>${money(data.actualPrice)}</strong></div>

                    <div class="mt-4 font-bold text-gray-100 mb-2">Mano de Obra Directa (MOD)</div>
                    <div class="text-sm text-gray-200">SR: <strong>${money(data.stdRate)}</strong> | SH/u: <strong>${data.stdHoursPerUnit}</strong></div>
                    <div class="text-sm text-gray-200">AH total: <strong>${data.actualHours.toFixed(2)}</strong> | AR: <strong>${money(data.actualRate)}</strong></div>
                </div>

                <div class="bg-gray-900/40 rounded-lg p-4 border border-gray-800">
                    <div class="font-bold text-gray-100 mb-2">Entregables (auditable)</div>
                    <div class="text-xs text-gray-400 mb-3">Ingresa variación (puede ser negativa). Tolerancia ±1%.</div>

                    <div class="grid grid-cols-1 gap-3">
                        <div class="grid grid-cols-3 gap-2 items-center">
                            <div class="text-gray-300 text-sm">1) MP Var Precio</div>
                            <input id="sc_mpv" type="number" step="0.01" class="col-span-2 bg-black/40 border border-gray-700 rounded px-3 py-2 text-white">
                        </div>
                        <div class="grid grid-cols-3 gap-2 items-center">
                            <div class="text-gray-300 text-sm">2) MP Var Cantidad</div>
                            <input id="sc_mqv" type="number" step="0.01" class="col-span-2 bg-black/40 border border-gray-700 rounded px-3 py-2 text-white">
                        </div>
                        <div class="grid grid-cols-3 gap-2 items-center">
                            <div class="text-gray-300 text-sm">3) MOD Var Tarifa</div>
                            <input id="sc_lrv" type="number" step="0.01" class="col-span-2 bg-black/40 border border-gray-700 rounded px-3 py-2 text-white">
                        </div>
                        <div class="grid grid-cols-3 gap-2 items-center">
                            <div class="text-gray-300 text-sm">4) MOD Var Eficiencia</div>
                            <input id="sc_lev" type="number" step="0.01" class="col-span-2 bg-black/40 border border-gray-700 rounded px-3 py-2 text-white">
                        </div>

                        <div class="bg-black/30 border border-gray-800 rounded-lg p-3">
                            <div class="text-sm text-gray-200 font-bold mb-2">5) Driver dominante</div>
                            <select id="sc_driver" class="w-full bg-black/40 border border-gray-700 rounded px-3 py-2 text-white">
                                <option value="">Seleccionar</option>
                                <option value="precio">Precio/Tarifa (AP vs SP, AR vs SR)</option>
                                <option value="eficiencia">Uso/Eficiencia (AQ vs SQ, AH vs SH)</option>
                            </select>
                        </div>

                        <div class="flex gap-2 mt-2">
                            <button onclick="validateStandardCosting()" class="flex-1 bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Validar</button>
                            <button onclick="resetCaseInputs()" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Reiniciar</button>
                        </div>
                        <div id="sc_feedback" class="text-sm text-gray-300 mt-2"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function validateStandardCosting() {
    const c = gameState.caseLab;
    if (!c || c.type !== "standard-costing") return;
    c.attempts += 1;

    const A = c.answers;
    const mpv = num(document.getElementById('sc_mpv')?.value);
    const mqv = num(document.getElementById('sc_mqv')?.value);
    const lrv = num(document.getElementById('sc_lrv')?.value);
    const lev = num(document.getElementById('sc_lev')?.value);
    const driver = document.getElementById('sc_driver')?.value || "";

    c.solved.mpv = withinTol(mpv, A.mpv);
    c.solved.mqv = withinTol(mqv, A.mqv);
    c.solved.lrv = withinTol(lrv, A.lrv);
    c.solved.lev = withinTol(lev, A.lev);
    c.solved.driver = (driver === A.driver);

    c.scoreLocal = Object.values(c.solved).filter(Boolean).length;
    updateCaseProgress();

    // KPI: Salud afectada por magnitud de variaciones
    const mag = (Math.abs(A.mpv)+Math.abs(A.mqv)+Math.abs(A.lrv)+Math.abs(A.lev)) / 1000;
    gameState.merma = clamp(mag, 0, 12);
    updateHUD();

    const fb = document.getElementById('sc_feedback');
    if (fb) fb.innerHTML = `<div class="font-bold text-white">Validación</div><div>Campos correctos: <strong>${c.scoreLocal}/5</strong></div>`;

    showMessage(c.scoreLocal >= 4 ? "✅ Análisis de variaciones consistente." : "⚠️ Revisa fórmula de variaciones y signo.", c.scoreLocal >= 4 ? "success" : "warning", 2400);
}

function round2(x) {
    return Math.round(x * 100) / 100;
}
function round4(x) {
    return Math.round(x * 10000) / 10000;
}

function finalizeProfessionalCase(opts = {}) {
    const city = cityData[gameState.currentCity];
    if (!gameState.caseLab || !city || !city.gameType) return;

    // Evita doble evaluación
    if (gameState.caseLab.locked) return;
    gameState.caseLab.locked = true;

    stopCaseTimer();

    const total = gameState.caseLab.totalFields || Object.keys(gameState.caseLab.answers || {}).filter(k => !k.startsWith('_')).length;
    const correct = Object.values(gameState.caseLab.solved || {}).filter(Boolean).length;

    // Puntaje base: 12 pts por campo correcto, -4 por intento extra
    const attempts = Math.max(1, gameState.caseLab.attempts || 1);
    const timeBonus = Math.floor((gameState.caseLab.timeLeft || 0) / 15); // +1 cada 15s
    const scoreDelta = (correct * 12) - ((attempts - 1) * 4) + timeBonus;

    gameState.score += scoreDelta;

    // Recompensas
    const pct = total > 0 ? (correct / total) * 100 : 0;
    if (pct >= 80) {
        gameState.health = Math.min(100, gameState.health + 12);
        addCoins(3);
    } else if (pct >= 60) {
        addCoins(1);
    } else {
        gameState.health = Math.max(0, gameState.health - 12);
    }

    updateHUD();

    const postgradTotal = (gameState.caseLab.postgrad?.questions || []).length;
    const postgradCorrect = postgradTotal > 0
        ? gameState.caseLab.postgrad.questions.filter((_, idx) => gameState.caseLab.solved[`pg_${idx}`]).length
        : 0;

    const msg = `
        <div class="text-left">
            <div class="text-2xl font-extrabold">Caso evaluado</div>
            <div class="mt-2"><strong>Exactitud integral:</strong> ${correct}/${total} (${pct.toFixed(0)}%)</div>
            <div><strong>Defensa posgrado:</strong> ${postgradCorrect}/${postgradTotal}</div>
            <div><strong>Intentos:</strong> ${attempts} | <strong>Tiempo restante:</strong> ${gameState.caseLab.timeLeft}s</div>
            <div class="mt-2"><strong>Δ Puntaje:</strong> ${scoreDelta >= 0 ? "+" : ""}${scoreDelta}</div>
        </div>
    `;

    showMessage(msg, pct >= 80 ? "success" : (pct >= 60 ? "info" : "warning"), 4500);

    setTimeout(() => {
        showDecisionPanel();
    }, 1600);
}

function submitPuzzle() {
    const city = cityData[gameState.currentCity];
    // Retos profesionales (CaseLab)
    if (city && city.gameType && gameState.caseLab) {
        finalizeProfessionalCase();
        return;
    }
    if (!gameState.arcade) {
        // fallback por compatibilidad
        showDecisionPanel();
        return;
    }

    stopArcadeTimers();

    // Marca lo no bloqueado como incorrecto
    const remaining = gameState.arcade.panel.filter(m => !m.locked).length;
    if (remaining > 0 && gameState.arcade.stage === 'panel') {
        gameState.score -= remaining * 6;
    }

    const correct = gameState.arcade.correct;
    const total = gameState.arcade.total;
    const pct = total > 0 ? (correct / total) * 100 : 0;

    // Auditoría
    const totalReds = gameState.arcade.audit.flags.filter(x => x.red).length || 4;
    const found = gameState.arcade.audit.found;
    const wrong = gameState.arcade.audit.wrong;

    // Reglas de recompensa
    if (pct >= 80) {
        gameState.health = Math.min(100, gameState.health + 15);
        addCoins(4);
    } else if (pct >= 60) {
        addCoins(2);
    } else {
        gameState.health = Math.max(0, gameState.health - 10);
    }

    // Efecto auditoría sobre merma
    if (found >= 3 && wrong <= 1) {
        gameState.merma = Math.max(0, gameState.merma - 0.6);
        gameState.score += 15;
    } else if (wrong >= 3) {
        gameState.merma = Math.min(15, gameState.merma + 0.6);
        gameState.score -= 10;
    }

    updateHUD();

    // Mensaje resumen
    let msg = `
        <div class=\"text-left\">
            <div class=\"text-2xl font-extrabold\">⚡ Reto completado</div>
            <div class=\"mt-2\"><strong>Panel:</strong> ${correct}/${total} (${pct.toFixed(0)}%)</div>
            <div><strong>Auditoría:</strong> ${found}/${totalReds} banderas rojas, ${wrong} falsos positivos</div>
            <div class=\"mt-2\"><strong>Puntaje:</strong> ${gameState.score}</div>
        </div>
    `;

    showMessage(msg, pct >= 80 ? 'success' : (pct >= 60 ? 'info' : 'warning'), 4500);

    setTimeout(() => {
        showDecisionPanel();
    }, 1800);
}

function useTutorMode() {
    const city = cityData[gameState.currentCity];
    if (city && city.gameType && gameState.caseLab) {
        if (gameState.costocoins < 1) {
            showMessage('❌ No tienes suficientes COSTOCOINS<br>Necesitas al menos 1 para una pista', 'error', 2800);
            return;
        }
        addCoins(-1);
        // Pistas por tipo (fórmulas + control)
        let tip = '';
        if (city.gameType === 'kardex-simulator') {
            tip = `<div class='text-left'><div class='text-xl font-bold'>Pista – Kardex</div>
                   <div class='mt-2 text-sm'>FIFO: consume capas por antigüedad (unidades vendidas + merma) y valoriza remanente por capas.</div>
                   <div class='mt-2 text-sm'>Promedio: costo promedio = (Σ unidades·costo) / (Σ unidades). COGS = (salidas)·promedio.</div></div>`;
        } else if (city.gameType === 'job-order') {
            tip = `<div class='text-left'><div class='text-xl font-bold'>Pista – Órdenes</div>
                   <div class='mt-2 text-sm'>Tasa CIF = CIF presupuestado / base presupuestada. CIF aplicado (A) = tasa · uso real de la base en A.</div>
                   <div class='mt-2 text-sm'>Precio con margen m: Precio = Costo / (1-m).</div></div>`;
        } else if (city.gameType === 'process-costing') {
            tip = `<div class='text-left'><div class='text-xl font-bold'>Pista – Procesos (WA)</div>
                   <div class='mt-2 text-sm'>EU = completadas + (EWIP · % avance). Costo/EU = (BWIP + agregado) / EU.</div></div>`;
        } else if (city.gameType === 'abc-costing') {
            tip = `<div class='text-left'><div class='text-xl font-bold'>Pista – ABC</div>
                   <div class='mt-2 text-sm'>Tasa driver = costo del pool / driver total. CIF producto = Σ(driver producto · tasa).</div></div>`;
        } else if (city.gameType === 'standard-costing') {
            tip = `<div class='text-left'><div class='text-xl font-bold'>Pista – Variaciones</div>
                   <div class='mt-2 text-sm'>MP precio = AQ(AP-SP); MP cantidad = SP(AQ-SQ). MOD tarifa = AH(AR-SR); MOD eficiencia = SR(AH-SH).</div></div>`;
        }
        showMessage(tip, 'info', 6500);
        return;
    }
    if (gameState.costocoins < 1) {
        showMessage('❌ No tienes suficientes COSTOCOINS<br>Necesitas al menos 1 COSTOCOIN', 'error');
        return;
    }

    if (!gameState.arcade || gameState.arcade.stage !== 'panel') {
        showMessage('💡 El Tutor solo ayuda en la Ronda 1 (Panel de Control).', 'info');
        return;
    }

    gameState.costocoins--;
    updateHUD();

    // Revela pista del primer módulo sin bloquear y acerca el slider al objetivo
    const m = gameState.arcade.panel.find(x => !x.locked);
    if (!m) {
        showMessage('✅ Ya bloqueaste todo el Panel. ¡Vamos a la auditoría!', 'success');
        return;
    }

    const hintEl = document.getElementById(`hint-${m.index}`);
    if (hintEl) hintEl.style.display = 'block';

    const slider = document.getElementById(`slider-${m.index}`);
    if (slider) {
        slider.value = m.target;
        updateSliderValue(m.index);
    }

    // Bloqueo asistido (menos puntos)
    const prevScore = gameState.score;
    lockAnswer(m.index);
    // Penaliza el extra para que el tutor no sea OP
    gameState.score = Math.max(prevScore - 5, gameState.score - 5);
    updateHUD();
}

function startArcadeStage(stage, seconds) {
    stopArcadeTimers();
    gameState.arcade.stage = stage;
    gameState.arcade.timeLeft = seconds;
    updateArcadeHUD();

    gameState.arcade.timer = setInterval(() => {
        gameState.arcade.timeLeft--;
        updateArcadeHUD();

        if (gameState.arcade.timeLeft <= 0) {
            stopArcadeTimers();

            if (stage === 'panel') {
                showMessage('⏰ Tiempo. Pasas a auditoría con lo que lograste.', 'warning', 2500);
                startAuditHunt(cityData[gameState.currentCity]);
            } else if (stage === 'audit') {
                showMessage('⏰ Auditoría finalizada.', 'info', 2000);
                submitPuzzle();
            }
        }
    }, 1000);
}

function stopArcadeTimers() {
    if (gameState.arcade && gameState.arcade.timer) {
        clearInterval(gameState.arcade.timer);
        gameState.arcade.timer = null;
    }
}

function updateArcadeHUD() {
    const t = document.getElementById('arcade-time');
    const s = document.getElementById('arcade-streak');
    const p = document.getElementById('arcade-progress');
    const totalEl = document.getElementById('arcade-total');

    if (t && gameState.arcade) t.textContent = String(Math.max(0, gameState.arcade.timeLeft));
    if (s && gameState.arcade) s.textContent = String(gameState.arcade.streak);
    if (p && gameState.arcade) p.textContent = String(gameState.arcade.locked);
    if (totalEl && gameState.arcade) totalEl.textContent = String(gameState.arcade.total);
}

// Helpers
function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

function randBetween(a, b) {
    return a + Math.random() * (b - a);
}

function formatNum(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return '0';
    // Si es casi entero, mostrar entero
    if (Math.abs(n - Math.round(n)) < 1e-9) return String(Math.round(n));
    return n.toFixed(2);
}
function showDecisionPanel() {
    const city = cityData[gameState.currentCity];
    const decisionPanel = document.getElementById('decision-panel');
    const decisionOptions = document.getElementById('decision-options');
    
    if (!decisionPanel || !decisionOptions) return;
    
    decisionPanel.classList.remove('hidden');
    
    decisionOptions.innerHTML = city.decisions.map((decision, index) => `
        <button onclick="makeDecision(${index})" 
                class="decision-btn bg-gradient-to-br from-crimson-700 to-crimson-900 hover:from-crimson-600 hover:to-crimson-800 
                       text-white font-bold py-4 px-6 rounded-lg border-2 border-crimson-500 
                       transform hover:scale-105 transition-all text-left shadow-lg">
            <div class="text-lg mb-2">${String.fromCharCode(65 + index)})</div>
            <div>${decision.text}</div>
        </button>
    `).join('');
}

function makeDecision(decisionIndex) {
    const city = cityData[gameState.currentCity];
    const decision = city.decisions[decisionIndex];
    
    // Apply effects
    if (decision.effect.health) {
        gameState.health = Math.max(0, Math.min(100, gameState.health + decision.effect.health));
    }
    if (decision.effect.coins) {
        gameState.costocoins = Math.max(0, gameState.costocoins + decision.effect.coins);
    }
    if (decision.effect.cu) {
        gameState.cu.actual += decision.effect.cu;
    }
    if (decision.effect.merma) {
        gameState.merma = Math.max(0, gameState.merma + decision.effect.merma);
    }
    if (decision.effect.margen) {
        gameState.margen += decision.effect.margen;
    }
    
    updateHUD();
    
    // Show feedback
    showMessage(`<strong>Decisión tomada:</strong><br><br>${decision.feedback}`, "info", 4000);
    
    // Calculate final grade
    const goalsAchieved = calculateGoalsAchieved();
    let medal = '🥉'; // Bronze
    let medalName = 'Bronce';
    let coinsReward = 2;
    
    if (goalsAchieved === 3) {
        medal = '🥇';
        medalName = 'Oro';
        coinsReward = 5;
    } else if (goalsAchieved === 2) {
        medal = '🥈';
        medalName = 'Plata';
        coinsReward = 3;
    }
    
    gameState.medals[gameState.currentCity] = medal;
    addCoins(coinsReward);
    
    // Update city medal on map
    const medalEl = document.getElementById(`medal-${gameState.currentCity}`);
    if (medalEl) {
        medalEl.textContent = medal;
    }
    
    // Show results
    setTimeout(() => {
        showLevelResults(medal, medalName, goalsAchieved);
    }, 4000);
}

function calculateGoalsAchieved() {
    let achieved = 0;
    
    // Check CU
    if (gameState.cu.actual <= gameState.cu.objetivo) achieved++;
    
    // Check Merma
    if (gameState.merma <= 4) achieved++;
    
    // Check Health
    if (gameState.health >= 70) achieved++;
    
    return achieved;
}

function showLevelResults(medal, medalName, goalsAchieved) {
    const decisionPanel = document.getElementById('decision-panel');
    const levelResults = document.getElementById('level-results');
    
    if (decisionPanel) decisionPanel.classList.add('hidden');
    if (!levelResults) return;
    
    levelResults.classList.remove('hidden');
    
    const medalEarned = document.getElementById('medal-earned');
    if (medalEarned) {
        medalEarned.textContent = medal;
        medalEarned.classList.add('animate-bounce-slow');
    }
    
    const resultsSummary = document.getElementById('results-summary');
    if (resultsSummary) {
        resultsSummary.innerHTML = `
            <p class="text-2xl font-bold text-yellow-300 mb-3">Medalla: ${medalName}</p>
            <p class="text-white"><strong>Metas alcanzadas:</strong> ${goalsAchieved}/3</p>
            <p class="text-white"><strong>Puntos totales:</strong> ${gameState.score}</p>
            <p class="text-white"><strong>COSTOCOINS:</strong> ${gameState.costocoins}</p>
            <p class="text-white"><strong>Salud de Costos:</strong> ${gameState.health}/100</p>
            <hr class="my-3 border-gray-600">
            <p class="text-${gameState.cu.actual <= gameState.cu.objetivo ? 'green' : 'red'}-400">
                <strong>CU:</strong> $${gameState.cu.actual.toFixed(2)} / $${gameState.cu.objetivo.toFixed(2)}
                ${gameState.cu.actual <= gameState.cu.objetivo ? '✓' : '✗'}
            </p>
            <p class="text-${gameState.merma <= 4 ? 'green' : 'red'}-400">
                <strong>Merma:</strong> ${gameState.merma.toFixed(1)}% ${gameState.merma <= 4 ? '✓' : '✗'}
            </p>
            <p class="text-${gameState.health >= 70 ? 'green' : 'red'}-400">
                <strong>Salud:</strong> ${gameState.health}/100 ${gameState.health >= 70 ? '✓' : '✗'}
            </p>
        `;
    }
}

function backToCityMap() {
    document.getElementById('city-game').classList.add('hidden');
    document.getElementById('city-map').classList.remove('hidden');
    gameState.currentScene = 'map';
}

// HUD Updates
function updateHUD() {
    const hudCu = document.getElementById('hud-cu');
    const hudMerma = document.getElementById('hud-merma');
    const hudMargen = document.getElementById('hud-margen');
    const hudCoins = document.getElementById('hud-coins');
    
    if (hudCu) hudCu.textContent = `$${gameState.cu.actual.toFixed(2)} / $${gameState.cu.objetivo.toFixed(2)}`;
    if (hudMerma) hudMerma.textContent = `${gameState.merma.toFixed(1)}%`;
    if (hudMargen) hudMargen.textContent = `${gameState.margen.toFixed(1)}%`;
    if (hudCoins) hudCoins.textContent = gameState.costocoins;
    
    // Health bar
    const healthBar = document.getElementById('health-bar');
    const healthText = document.getElementById('health-text');
    
    if (healthBar && healthText) {
        healthBar.style.width = `${gameState.health}%`;
        healthText.textContent = gameState.health;
        
        // Color based on health
        if (gameState.health >= 70) {
            healthBar.className = 'health-bar bg-gradient-to-r from-green-500 to-green-400 h-4 rounded-full transition-all duration-500';
        } else if (gameState.health >= 40) {
            healthBar.className = 'health-bar bg-gradient-to-r from-yellow-500 to-yellow-400 h-4 rounded-full transition-all duration-500';
        } else {
            healthBar.className = 'health-bar bg-gradient-to-r from-red-500 to-red-400 h-4 rounded-full transition-all duration-500';
        }
    }
}

function startTimer() {
    if (gameState.timer) clearInterval(gameState.timer);
    
    gameState.time = 0;
    gameState.timer = setInterval(() => {
        gameState.time++;
        const minutes = Math.floor(gameState.time / 60);
        const seconds = gameState.time % 60;
        const hudTime = document.getElementById('hud-time');
        if (hudTime) {
            hudTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function addCoins(amount) {
    gameState.costocoins += amount;
    updateHUD();
    
    // Animate coin icon
    const coinIcon = document.querySelector('.coin-icon');
    if (coinIcon) {
        coinIcon.classList.add('combo-effect');
        setTimeout(() => coinIcon.classList.remove('combo-effect'), 500);
    }
}

// Message System - MEJORADO
function showMessage(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    
    const colors = {
        success: 'bg-green-700 border-green-500',
        error: 'bg-red-700 border-red-500',
        warning: 'bg-yellow-700 border-yellow-500',
        info: 'bg-crimson-700 border-crimson-500'
    };
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.className = `fixed top-24 right-4 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-in max-w-md border-2`;
    toast.innerHTML = `
        <div class="flex items-start gap-3">
            <div class="text-2xl">${icons[type]}</div>
            <div class="flex-1">${message}</div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Initialize on load
window.addEventListener('DOMContentLoaded', initGame);


/* ============================================================
   COSTÓPOLIS v3 — MiniJuegos Dinámicos (sin sliders repetitivos)
   - Activa "Continuar al Puzzle" sin requerir secuencia
   - Cada ciudad usa un mini-juego distinto según gameType
   ============================================================ */

// --- Utilidades Mini ---
function miniStopTimer() {
    if (gameState.mini && gameState.mini.timer) {
        clearInterval(gameState.mini.timer);
        gameState.mini.timer = null;
    }
    if (gameState.mini && gameState.mini.tick) {
        clearInterval(gameState.mini.tick);
        gameState.mini.tick = null;
    }
}
function miniHUDSet({ timeLeft = 0, streak = 0, progress = 0, total = 0 } = {}) {
    const t = document.getElementById('arcade-time');
    const s = document.getElementById('arcade-streak');
    const p = document.getElementById('arcade-progress');
    const tot = document.getElementById('arcade-total');
    if (t) t.textContent = String(Math.max(0, Math.floor(timeLeft)));
    if (s) s.textContent = String(Math.max(0, Math.floor(streak)));
    if (p) p.textContent = String(Math.max(0, Math.floor(progress)));
    if (tot) tot.textContent = String(Math.max(0, Math.floor(total)));
}
function miniSetStageLabel(text) {
    const el = document.getElementById('arcade-stage-label');
    if (el) el.textContent = text;
}
function miniClearPuzzleArea() {
    const q = document.getElementById('puzzle-questions');
    if (q) q.innerHTML = '';
    const audit = document.getElementById('audit-zone');
    if (audit) audit.classList.add('hidden');
    const decisionPanel = document.getElementById('decision-panel');
    if (decisionPanel) decisionPanel.classList.add('hidden');
    const levelResults = document.getElementById('level-results');
    if (levelResults) levelResults.classList.add('hidden');
    const form = document.getElementById('puzzle-form');
    if (form) form.classList.remove('hidden');
}
function miniButtons({ showTutor = false, finalizeText = "Finalizar Reto" } = {}) {
    const btns = document.querySelectorAll('#scene-puzzle button');
    // Conservador: ajustar solo los dos botones del centro
    const finalize = document.querySelector('#puzzle-form button[onclick="submitPuzzle()"]');
    const tutor = document.querySelector('#puzzle-form button[onclick="useTutorMode()"]');
    if (finalize) finalize.textContent = finalizeText;
    if (tutor) tutor.style.display = showTutor ? '' : 'none';
}
function miniCountdown(seconds, onEnd) {
    miniStopTimer();
    if (!gameState.mini) gameState.mini = {};
    gameState.mini.timeLeft = seconds;
    miniHUDSet({ timeLeft: seconds, streak: 0, progress: 0, total: 0 });
    gameState.mini.timer = setInterval(() => {
        gameState.mini.timeLeft--;
        miniHUDSet({
            timeLeft: gameState.mini.timeLeft,
            streak: gameState.mini.streak || 0,
            progress: gameState.mini.progress || 0,
            total: gameState.mini.total || 0
        });
        if (gameState.mini.timeLeft <= 0) {
            miniStopTimer();
            if (typeof onEnd === 'function') onEnd();
        }
    }, 1000);
}
function miniDone({ message = "✅ ¡Reto completado! Pulsa Finalizar.", rewardCoins = 2, heal = 0, score = 25 } = {}) {
    if (!gameState.mini) gameState.mini = {};
    gameState.mini.completed = true;
    gameState.mini.result = { rewardCoins, heal, score };
    gameState.score += score;
    if (heal) gameState.health = Math.max(0, Math.min(100, gameState.health + heal));
    addCoins(rewardCoins);
    updateHUD();
    showMessage(message, 'success', 2200);
}
function miniFail({ message = "❌ Te faltó completar el reto. Intenta de nuevo.", damage = 8, score = -10 } = {}) {
    if (!gameState.mini) gameState.mini = {};
    gameState.mini.completed = false;
    gameState.score += score;
    gameState.health = Math.max(0, gameState.health - damage);
    updateHUD();
    showMessage(message, 'warning', 2500);
}

// --- Override: initPuzzle (sin sliders) ---
function initPuzzle() {
    const city = cityData[gameState.currentCity];
    if (!city) return;

    // Reset
    miniStopTimer();
    gameState.arcade = null;           // desactiva el modo slider antiguo
    gameState.mini = { type: city.gameType, completed: false, streak: 0, progress: 0, total: 1 };

    miniClearPuzzleArea();
    miniButtons({ showTutor: false, finalizeText: "Finalizar Reto" });

    // Asegura que "Continuar al Puzzle" NO dependa de visitar zonas
    const btnContinue = document.getElementById('btn-continue-puzzle');
    if (btnContinue) btnContinue.disabled = false;

    // Encabezado dinámico
    const title = document.querySelector('#scene-puzzle h4');
    const subtitle = document.querySelector('#scene-puzzle p');
    if (title) title.textContent = `⚡ ${city.objective}`;
    if (subtitle) subtitle.textContent = "Minijuego interactivo (sin preguntas tipo examen). ¡Juega, decide y optimiza!";

    // Render según tipo de ciudad
    switch (city.gameType) {
        case 'classification':
            // Mantener lógica original: vuelve a atrapa (ya jugaste), aquí reto final rápido estilo “caza”
            renderMiniQuickClassify(city);
            break;
        case 'kardex-simulator':
            renderMiniKardex(city);
            break;
        case 'job-order':
            renderMiniJobOrder(city);
            break;
        case 'process-costing':
            renderMiniProcessFlow(city);
            break;
        case 'abc-costing':
            renderMiniABC(city);
            break;
        case 'standard-costing':
            renderMiniVarianceHunter(city);
            break;
        case 'bottleneck':
            renderMiniTOC(city);
            break;
        default:
            renderMiniFallback(city);
    }
}

// --- Override: submitPuzzle ---
function submitPuzzle() {
    // Si hay minijuego, validar finalización
    if (gameState.mini) {
        miniStopTimer();

        if (!gameState.mini.completed) {
            showMessage("⚠️ Aún no completas el reto. Termina el objetivo primero.", "warning", 2200);
            return;
        }

        // Bonus por tiempo
        const bonus = (typeof gameState.mini.timeLeft === 'number' && gameState.mini.timeLeft > 0)
            ? Math.min(25, Math.floor(gameState.mini.timeLeft / 2))
            : 0;

        gameState.score += bonus;
        if (bonus > 0) showMessage(`⏱️ Bonus velocidad: +${bonus} puntos`, "success", 1800);

        updateHUD();

        // Ir a decisión final
        setTimeout(() => showDecisionPanel(), 600);
        return;
    }

    // Compatibilidad si algo viejo llama
    showDecisionPanel();
}

// --- Override: tutor (pista contextual) ---
function useTutorMode() {
    if (!gameState.mini) {
        showMessage("💡 Tutor no disponible aquí.", "info");
        return;
    }
    if (gameState.costocoins < 1) {
        showMessage('❌ No tienes suficientes COSTOCOINS<br>Necesitas al menos 1 COSTOCOIN', 'error');
        return;
    }
    gameState.costocoins--;
    updateHUD();

    const tips = {
        'kardex-simulator': "Tip Kardex: en PEPS/FEFO siempre agota el lote más antiguo primero. Evita usar lotes nuevos si el viejo aún tiene unidades.",
        'job-order': "Tip Órdenes: MPD y MOD se rastrean a la orden; CIF se aplica con una base (horas MOD). Si el token dice 'aplicado' va al CIF.",
        'process-costing': "Tip Procesos: Materiales suelen agregarse al inicio (WIP ≈ 100% MP). Conversión se acumula (usa %).",
        'abc-costing': "Tip ABC: Identifica el driver correcto por actividad (setups, inspecciones, despachos). Producto con más drivers suele estar subcosteado.",
        'standard-costing': "Tip Variaciones: Haz clic solo en variaciones DESFAVORABLES (D). Las Favorables (F) son trampa.",
        'bottleneck': "Tip TOC: prioriza contribución por minuto. Si A tiene $8/4min y B $10/8min, A rinde más por minuto."
    };
    showMessage(`💡 ${tips[gameState.mini.type] || "Juega con calma: mira patrones y optimiza."}`, "info", 4200);
}

/* =========================
   MINIJUEGO 1: Quick Classify (final)
   ========================= */
function renderMiniQuickClassify(city) {
    miniSetStageLabel("Reto Final: Clasificación Express (30s) — arrastra rápido al tipo correcto");

    const q = document.getElementById('puzzle-questions');
    if (!q) return;

    // Generar 10 tarjetas rápidas desde el set original
    const pool = (city.cards || []).slice(0, 18);
    const cards = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);

    gameState.mini.total = cards.length;
    gameState.mini.progress = 0;
    gameState.mini.streak = 0;
    gameState.mini.correct = 0;
    gameState.mini.wrong = 0;

    q.innerHTML = `
      <div class="bg-black/30 rounded-lg p-5 border border-gray-700">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
          <div>
            <div class="text-lg font-bold text-orange-200">🎯 Objetivo</div>
            <div class="text-sm text-gray-300">Clasifica 8/10 antes del tiempo. Evita las trampas.</div>
          </div>
          <div class="bg-gray-900/60 rounded-lg px-4 py-2 border border-gray-700 text-sm">
            <span class="text-gray-400">Correctas:</span>
            <span id="qc-correct" class="font-extrabold text-white">0</span> /
            <span class="text-gray-400">Errores:</span>
            <span id="qc-wrong" class="font-extrabold text-white">0</span>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4" id="qc-zones">
          ${['MPD','MOD','CIF','GA','GV'].map(t => `
            <div class="qc-zone bg-gray-900/40 border-2 border-gray-700 rounded-lg p-3 min-h-[90px] text-center"
                 data-qc="${t}">
              <div class="font-bold text-white">${t}</div>
              <div class="text-xs text-gray-400">${t==='GA'?'Gastos Adm':(t==='GV'?'Gastos Venta':t)}</div>
            </div>
          `).join('')}
        </div>

        <div class="bg-black/20 border-2 border-dashed border-gray-600 rounded-lg p-4">
          <div class="text-xs text-gray-400 text-center mb-3">Arrastra estas tarjetas</div>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3" id="qc-cards"></div>
        </div>
      </div>
    `;

    const grid = document.getElementById('qc-cards');
    grid.innerHTML = cards.map((c, i) => `
      <div draggable="true"
           class="qc-card bg-gradient-to-br from-blue-600 to-blue-900 border-2 border-blue-400 rounded-lg p-3 cursor-move hover:scale-105 transition-transform"
           data-qc-id="${i}"
           data-qc-type="${c.type}"
           data-qc-trap="${c.trap ? '1':'0'}"
           ondragstart="miniDragStart(event,'qc')">
        <div class="text-xs font-bold text-white text-center">${c.name}</div>
        ${c.trap ? '<div class="text-center text-yellow-300 text-xs mt-1">⚠️ Trampa</div>' : ''}
      </div>
    `).join('');

    // zonas drop
    document.querySelectorAll('.qc-zone').forEach(z => {
        z.addEventListener('dragover', e => { e.preventDefault(); z.classList.add('border-orange-400'); });
        z.addEventListener('dragleave', () => z.classList.remove('border-orange-400'));
        z.addEventListener('drop', e => {
            e.preventDefault();
            z.classList.remove('border-orange-400');
            const id = e.dataTransfer.getData('miniId');
            const type = e.dataTransfer.getData('miniType');
            const scope = e.dataTransfer.getData('miniScope');
            if (scope !== 'qc') return;
            const el = document.querySelector(`.qc-card[data-qc-id="${id}"]`);
            if (!el) return;

            const expected = type;
            const got = z.dataset.qc;
            const correct = expected === got;

            if (correct) {
                gameState.mini.correct++;
                gameState.mini.streak++;
                gameState.mini.progress++;
                gameState.score += 8;
                if (el.dataset.qcTrap === '1') gameState.score += 8;
                el.classList.add('opacity-60');
                el.draggable = false;
                z.appendChild(el);
                showMessage("✅ Bien", "success", 900);
            } else {
                gameState.mini.wrong++;
                gameState.mini.streak = 0;
                gameState.health = Math.max(0, gameState.health - 2);
                showMessage("❌ No era esa bandeja", "error", 900);
                el.classList.add('shake');
                setTimeout(() => el.classList.remove('shake'), 300);
            }

            document.getElementById('qc-correct').textContent = String(gameState.mini.correct);
            document.getElementById('qc-wrong').textContent = String(gameState.mini.wrong);
            miniHUDSet({ timeLeft: gameState.mini.timeLeft || 30, streak: gameState.mini.streak, progress: gameState.mini.progress, total: gameState.mini.total });

            if (gameState.mini.progress >= 8) {
                miniDone({ message: "🏁 ¡Clasificación express completada! Pulsa Finalizar.", rewardCoins: 3, heal: 6, score: 35 });
            }
        });
    });

    // timer
    miniCountdown(30, () => {
        if (gameState.mini.progress >= 8) {
            miniDone({ message: "🏁 ¡A tiempo! Pulsa Finalizar.", rewardCoins: 3, heal: 6, score: 25 });
        } else {
            miniFail({ message: "⏰ Se acabó el tiempo. Te faltó clasificar 8/10.", damage: 6, score: -8 });
        }
    });

    miniHUDSet({ timeLeft: 30, streak: 0, progress: 0, total: cards.length });
}

// Drag helper genérico
function miniDragStart(e, scope) {
    const t = e.target;
    e.dataTransfer.setData('miniScope', scope);
    e.dataTransfer.setData('miniId', t.dataset.qcId || t.dataset.batchIndex || t.dataset.tokenId || '');
    e.dataTransfer.setData('miniType', t.dataset.qcType || t.dataset.tokenType || '');
    e.dataTransfer.effectAllowed = 'move';
}

/* =========================
   MINIJUEGO 2: Kardex / Bodega (drag lotes)
   ========================= */
function renderMiniKardex(city) {
    miniSetStageLabel("Bodega: Kardex Sprint (45s) — usa PEPS/Promedio para cubrir la salida");

    const q = document.getElementById('puzzle-questions');
    if (!q) return;

    const data = city.inventoryData;
    const needed = data.sales.units + (data.waste || 0);

    // Estado
    gameState.mini.total = needed;
    gameState.mini.progress = 0;
    gameState.mini.mode = (Math.random() < 0.5) ? 'PEPS' : 'PROMEDIO';
    gameState.mini.cogs = 0;
    gameState.mini.outUnits = 0;
    gameState.mini.violations = 0;

    // Copia lotes
    const lots = data.purchases.map((p, i) => ({ ...p, idx: i, remaining: p.units }));
    gameState.mini.lots = lots;

    q.innerHTML = `
      <div class="bg-black/30 rounded-lg p-5 border border-gray-700">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
          <div>
            <div class="text-lg font-bold text-orange-200">📦 Objetivo</div>
            <div class="text-sm text-gray-300">Cubre <strong>${needed}</strong> unidades (Ventas ${data.sales.units} + Merma ${data.waste}) usando el método asignado.</div>
          </div>
          <div class="bg-gray-900/60 rounded-lg px-4 py-2 border border-gray-700 text-sm">
            <div><span class="text-gray-400">Método:</span> <span class="font-extrabold text-white">${gameState.mini.mode}</span></div>
            <div><span class="text-gray-400">Salida:</span> <span id="k-out" class="font-extrabold text-white">0</span>/${needed}</div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-gray-900/40 rounded-lg p-4 border border-gray-700">
            <div class="font-bold text-white mb-2">Lotes (arrástralos)</div>
            <div id="k-lots" class="space-y-2"></div>
            <div class="text-xs text-gray-400 mt-3">En PEPS, debes agotar el lote más antiguo primero.</div>
          </div>

          <div class="bg-gray-900/40 rounded-lg p-4 border-2 border-orange-500 rounded-lg">
            <div class="font-bold text-white mb-2 text-center">🚚 SALIDA</div>
            <div class="text-sm text-gray-300 text-center mb-3">Suelta aquí para despachar unidades</div>
            <div id="k-drop" class="min-h-[170px] border-2 border-dashed border-orange-400 rounded-lg p-3 bg-black/20"></div>
            <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div class="bg-black/30 rounded-lg p-2 border border-gray-700">
                <div class="text-gray-400 text-xs">COGS</div>
                <div class="font-extrabold text-white">$ <span id="k-cogs">0</span></div>
              </div>
              <div class="bg-black/30 rounded-lg p-2 border border-gray-700">
                <div class="text-gray-400 text-xs">CU salida</div>
                <div class="font-extrabold text-white">$ <span id="k-cu">0</span></div>
              </div>
            </div>
            <div class="text-xs text-gray-400 mt-2 text-center">Errores de método: <span id="k-viol" class="font-bold text-white">0</span></div>
          </div>
        </div>
      </div>
    `;

    const lotsEl = document.getElementById('k-lots');
    function renderLots() {
        lotsEl.innerHTML = lots.map(l => `
          <div draggable="${l.remaining>0 ? 'true':'false'}"
               class="bg-gradient-to-br from-blue-700 to-blue-900 border-2 ${l.remaining>0 ? 'border-blue-400 cursor-move' : 'border-gray-700 opacity-40'} rounded-lg p-3"
               data-batch-index="${l.idx}"
               ondragstart="miniDragStart(event,'kardex')">
            <div class="flex justify-between items-center">
              <div class="font-bold text-white text-sm">${l.date}</div>
              <div class="text-xs text-gray-300">${l.remaining}/${l.units} u</div>
            </div>
            <div class="text-xs text-gray-300 mt-1">Costo: $${l.price}/u</div>
          </div>
        `).join('');
    }
    renderLots();

    const drop = document.getElementById('k-drop');
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('border-green-400'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('border-green-400'));
    drop.addEventListener('drop', e => {
        e.preventDefault();
        drop.classList.remove('border-green-400');
        const scope = e.dataTransfer.getData('miniScope');
        if (scope !== 'kardex') return;
        const idx = parseInt(e.dataTransfer.getData('miniId') || '-1', 10);
        const lot = lots.find(x => x.idx === idx);
        if (!lot || lot.remaining <= 0) return;

        const remainingNeed = needed - gameState.mini.outUnits;
        if (remainingNeed <= 0) return;

        if (gameState.mini.mode === 'PEPS') {
            const first = lots.find(x => x.remaining > 0);
            if (first && first.idx !== lot.idx) {
                gameState.mini.violations++;
                document.getElementById('k-viol').textContent = String(gameState.mini.violations);
                showMessage("⚠️ En PEPS primero agota el lote más antiguo.", "warning", 1600);
                return;
            }
        }

        const take = Math.min(lot.remaining, remainingNeed);
        lot.remaining -= take;
        gameState.mini.outUnits += take;

        // Costeo
        if (gameState.mini.mode === 'PROMEDIO') {
            const totalUnits = data.purchases.reduce((a, b) => a + b.units, 0);
            const totalCost = data.purchases.reduce((a, b) => a + b.units * b.price, 0);
            const avg = totalCost / totalUnits;
            gameState.mini.cogs = avg * gameState.mini.outUnits;
        } else {
            gameState.mini.cogs += take * lot.price;
        }

        gameState.mini.progress = gameState.mini.outUnits;
        document.getElementById('k-out').textContent = String(gameState.mini.outUnits);
        document.getElementById('k-cogs').textContent = formatNum(gameState.mini.cogs);
        document.getElementById('k-cu').textContent = gameState.mini.outUnits > 0 ? formatNum(gameState.mini.cogs / gameState.mini.outUnits) : '0';

        renderLots();
        drop.insertAdjacentHTML('beforeend', `<div class="text-xs text-gray-300">+${take}u desde ${lot.date}</div>`);

        miniHUDSet({ timeLeft: gameState.mini.timeLeft || 45, streak: 0, progress: gameState.mini.progress, total: gameState.mini.total });

        if (gameState.mini.outUnits >= needed) {
            // Ajuste de indicadores
            const cuSalida = (gameState.mini.cogs / needed);
            gameState.cu.actual = Number(cuSalida);
            updateHUD();
            miniDone({
                message: `🚚 ¡Salida cubierta! CU salida = $${formatNum(cuSalida)}. Pulsa Finalizar.`,
                rewardCoins: 3,
                heal: 5,
                score: 45
            });
        }
    });

    miniCountdown(45, () => {
        if (gameState.mini.outUnits >= needed) {
            miniDone({ message: "✅ ¡A tiempo! Pulsa Finalizar.", rewardCoins: 3, heal: 5, score: 30 });
        } else {
            miniFail({ message: `⏰ Tiempo. Cubriste ${gameState.mini.outUnits}/${needed} unidades.`, damage: 7, score: -10 });
        }
    });

    miniHUDSet({ timeLeft: 45, streak: 0, progress: 0, total: needed });
}

/* =========================
   MINIJUEGO 3: Órdenes (drag tokens)
   ========================= */
function renderMiniJobOrder(city) {
    miniSetStageLabel("Órdenes: Armador de Costos (60s) — asigna MPD/MOD/CIF a cada orden");

    const q = document.getElementById('puzzle-questions');
    if (!q) return;

    const d = city.jobOrderData;
    const orders = d.orders.map(o => ({
        ...o,
        expected: {
            MPD: o.materials,
            MOD: o.laborHours * o.laborRate,
            CIF: o.laborHours * o.overheadRate
        },
        placed: {}
    }));
    gameState.mini.orders = orders;
    gameState.mini.total = 6;
    gameState.mini.progress = 0;
    gameState.mini.correct = 0;

    const tokens = [];
    orders.forEach(o => {
        tokens.push({ id: `mpd-${o.id}`, orderId: o.id, type: 'MPD', label: `MPD $${o.materials}` });
        tokens.push({ id: `mod-${o.id}`, orderId: o.id, type: 'MOD', label: `MOD ${o.laborHours}h × $${o.laborRate} = $${o.laborHours*o.laborRate}` });
        tokens.push({ id: `cif-${o.id}`, orderId: o.id, type: 'CIF', label: `CIF ${o.laborHours}h × $${o.overheadRate} = $${o.laborHours*o.overheadRate}` });
    });

    q.innerHTML = `
      <div class="bg-black/30 rounded-lg p-5 border border-gray-700">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="md:w-1/2 bg-gray-900/40 rounded-lg p-4 border border-gray-700">
            <div class="font-bold text-white mb-2">🧩 Tokens de costo (arrástralos)</div>
            <div id="jo-tokens" class="space-y-2"></div>
            <div class="text-xs text-gray-400 mt-3">Pista: CIF se aplica por horas MOD.</div>
          </div>

          <div class="md:w-1/2 space-y-3" id="jo-orders"></div>
        </div>
        <div class="text-xs text-gray-400 mt-3 text-center">Completa los 6 slots (2 órdenes × 3 costos).</div>
      </div>
    `;

    const tEl = document.getElementById('jo-tokens');
    tEl.innerHTML = tokens.map(t => `
      <div draggable="true"
           class="bg-gradient-to-br from-blue-700 to-blue-900 border-2 border-blue-400 rounded-lg p-3 cursor-move hover:scale-105 transition-transform"
           data-token-id="${t.id}"
           data-token-type="${t.type}"
           data-token-order="${t.orderId}"
           ondragstart="miniDragStartToken(event)">
        <div class="text-xs font-bold text-white">${t.label}</div>
      </div>
    `).join('');

    const oEl = document.getElementById('jo-orders');
    oEl.innerHTML = orders.map(o => `
      <div class="bg-gray-900/40 rounded-lg p-4 border border-gray-700">
        <div class="flex justify-between items-center mb-2">
          <div class="font-bold text-white">Orden #${o.id}</div>
          <div class="text-xs text-gray-300">Unidades: ${o.units}</div>
        </div>
        <div class="grid grid-cols-3 gap-2">
          ${['MPD','MOD','CIF'].map(type => `
            <div class="jo-slot bg-black/20 border-2 border-dashed border-gray-600 rounded-lg p-2 min-h-[70px]"
                 data-order="${o.id}" data-type="${type}">
              <div class="text-xs text-gray-400 mb-1">${type}</div>
              <div class="text-xs text-gray-200 jo-val">—</div>
            </div>
          `).join('')}
        </div>
        <div class="mt-3 text-xs text-gray-300">
          Total: <span id="jo-total-${o.id}" class="font-bold text-white">—</span>
          · CU: <span id="jo-cu-${o.id}" class="font-bold text-white">—</span>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.jo-slot').forEach(slot => {
        slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('border-green-400'); });
        slot.addEventListener('dragleave', () => slot.classList.remove('border-green-400'));
        slot.addEventListener('drop', e => {
            e.preventDefault();
            slot.classList.remove('border-green-400');

            const tokId = e.dataTransfer.getData('miniTokId');
            const tokType = e.dataTransfer.getData('miniTokType');
            const tokOrder = e.dataTransfer.getData('miniTokOrder');

            const orderId = slot.dataset.order;
            const type = slot.dataset.type;

            if (!tokId) return;
            if (tokType !== type || tokOrder !== orderId) {
                slot.classList.add('shake');
                setTimeout(() => slot.classList.remove('shake'), 320);
                gameState.health = Math.max(0, gameState.health - 2);
                updateHUD();
                showMessage("❌ Token no corresponde a ese slot/orden.", "error", 1400);
                return;
            }

            const tokEl = document.querySelector(`[data-token-id="${tokId}"]`);
            if (!tokEl || tokEl.dataset.locked === '1') return;

            // Lock
            tokEl.dataset.locked = '1';
            tokEl.classList.add('opacity-40');
            tokEl.draggable = false;

            const ord = orders.find(o => String(o.id) === String(orderId));
            if (!ord) return;
            ord.placed[type] = true;

            // Mostrar valor
            const valEl = slot.querySelector('.jo-val');
            const expectedVal = ord.expected[type];
            valEl.textContent = `$${formatNum(expectedVal)}`;

            gameState.mini.progress++;
            gameState.score += 8;

            // Totales si completa
            if (ord.placed.MPD && ord.placed.MOD && ord.placed.CIF) {
                const total = ord.expected.MPD + ord.expected.MOD + ord.expected.CIF;
                const cu = total / ord.units;
                document.getElementById(`jo-total-${ord.id}`).textContent = `$${formatNum(total)}`;
                document.getElementById(`jo-cu-${ord.id}`).textContent = `$${formatNum(cu)}`;
                gameState.score += 10;
            }

            miniHUDSet({ timeLeft: gameState.mini.timeLeft || 60, streak: 0, progress: gameState.mini.progress, total: gameState.mini.total });

            // Fin
            const allDone = orders.every(o => o.placed.MPD && o.placed.MOD && o.placed.CIF);
            if (allDone) {
                // Ajuste: CU promedio (solo para HUD)
                const totCost = orders.reduce((a, o) => a + o.expected.MPD + o.expected.MOD + o.expected.CIF, 0);
                const totUnits = orders.reduce((a, o) => a + o.units, 0);
                gameState.cu.actual = Number(totCost / totUnits);
                updateHUD();
                miniDone({ message: `🏭 Órdenes completadas. CU promedio = $${formatNum(gameState.cu.actual)}. Pulsa Finalizar.`, rewardCoins: 3, heal: 6, score: 55 });
            }
        });
    });

    miniCountdown(60, () => {
        const allDone = orders.every(o => o.placed.MPD && o.placed.MOD && o.placed.CIF);
        if (allDone) {
            miniDone({ message: "✅ ¡A tiempo! Pulsa Finalizar.", rewardCoins: 3, heal: 6, score: 30 });
        } else {
            miniFail({ message: "⏰ Tiempo. No lograste completar las 2 órdenes.", damage: 8, score: -12 });
        }
    });

    miniHUDSet({ timeLeft: 60, streak: 0, progress: 0, total: gameState.mini.total });
}

function miniDragStartToken(e) {
    const t = e.target.closest('[data-token-id]');
    if (!t) return;
    e.dataTransfer.setData('miniTokId', t.dataset.tokenId);
    e.dataTransfer.setData('miniTokType', t.dataset.tokenType);
    e.dataTransfer.setData('miniTokOrder', t.dataset.tokenOrder);
    e.dataTransfer.effectAllowed = 'move';
}

/* =========================
   MINIJUEGO 4: Procesos (route runner)
   ========================= */
function renderMiniProcessFlow(city) {
    miniSetStageLabel("Procesos: Ruta de Producción (45s) — dirige piezas al depto correcto");

    const q = document.getElementById('puzzle-questions');
    if (!q) return;

    // Creamos una pista simple con 2 válvulas: Materiales (Inicio) vs Conversión (Acumulado)
    // Piezas aparecen con etiqueta: MP (debe ir a 'Inicio') o CONV (debe ir a 'Acumulado')
    const total = 18;
    gameState.mini.total = total;
    gameState.mini.progress = 0;
    gameState.mini.correct = 0;
    gameState.mini.wrong = 0;

    q.innerHTML = `
      <div class="bg-black/30 rounded-lg p-5 border border-gray-700">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
          <div>
            <div class="text-lg font-bold text-orange-200">🏭 Objetivo</div>
            <div class="text-sm text-gray-300">Haz clic en la válvula correcta para cada pieza: <strong>MP → Inicio</strong>, <strong>CONV → Acumulado</strong>.</div>
          </div>
          <div class="bg-gray-900/60 rounded-lg px-4 py-2 border border-gray-700 text-sm">
            <span class="text-gray-400">Aciertos:</span> <span id="pf-ok" class="font-extrabold text-white">0</span> ·
            <span class="text-gray-400">Errores:</span> <span id="pf-bad" class="font-extrabold text-white">0</span>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-4 items-stretch">
          <div class="md:col-span-2 bg-gray-900/40 rounded-lg p-4 border border-gray-700">
            <div class="flex justify-between items-center mb-3">
              <div class="font-bold text-white">Cinta de Proceso</div>
              <div class="text-xs text-gray-400">Pieza actual: <span id="pf-tag" class="font-bold text-white">—</span></div>
            </div>
            <div class="bg-black/20 border-2 border-dashed border-gray-600 rounded-lg p-4 min-h-[140px] flex items-center justify-center">
              <div id="pf-piece" class="text-center">
                <div class="text-5xl">⚙️</div>
                <div class="mt-2 text-sm text-gray-300">Presiona una válvula</div>
              </div>
            </div>
          </div>

          <div class="bg-gray-900/40 rounded-lg p-4 border border-gray-700 flex flex-col gap-3">
            <button id="pf-inicio" class="bg-green-700 hover:bg-green-600 text-white font-bold py-3 rounded-lg">
              ✅ Inicio (MP)
            </button>
            <button id="pf-acum" class="bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 rounded-lg">
              ✅ Acumulado (CONV)
            </button>
            <div class="text-xs text-gray-400 mt-auto">Regla: MP se agrega al inicio del proceso; conversión se acumula.</div>
          </div>
        </div>
      </div>
    `;

    const tags = Array.from({ length: total }, (_, i) => (Math.random() < 0.55 ? 'MP' : 'CONV'));
    gameState.mini.queue = tags;

    const pfTag = document.getElementById('pf-tag');
    const pfPiece = document.getElementById('pf-piece');
    const okEl = document.getElementById('pf-ok');
    const badEl = document.getElementById('pf-bad');

    function nextPiece() {
        const tag = gameState.mini.queue.shift();
        if (!tag) {
            // fin
            if (gameState.mini.correct >= 14) {
                gameState.merma = Math.max(0, gameState.merma - 0.4);
                updateHUD();
                miniDone({ message: "🏁 Flujo dominado. Merma ↓. Pulsa Finalizar.", rewardCoins: 3, heal: 5, score: 50 });
            } else {
                miniFail({ message: "🏁 Terminaste, pero con demasiados errores.", damage: 7, score: -8 });
            }
            return;
        }
        gameState.mini.current = tag;
        if (pfTag) pfTag.textContent = tag;
        if (pfPiece) {
            pfPiece.innerHTML = `
              <div class="text-5xl">${tag === 'MP' ? '📦' : '⚡'}</div>
              <div class="mt-2 text-sm text-gray-200 font-bold">${tag === 'MP' ? 'Materia Prima' : 'Conversión'}</div>
              <div class="text-xs text-gray-400">Elige la válvula correcta</div>
            `;
        }
    }

    function choose(choice) {
        const tag = gameState.mini.current;
        const correct = (tag === 'MP' && choice === 'inicio') || (tag === 'CONV' && choice === 'acum');
        if (correct) {
            gameState.mini.correct++;
            gameState.mini.progress++;
            gameState.score += 6;
            showMessage("✅ Bien", "success", 700);
        } else {
            gameState.mini.wrong++;
            gameState.health = Math.max(0, gameState.health - 2);
            gameState.score -= 3;
            showMessage("❌ Válvula incorrecta", "error", 900);
        }
        okEl.textContent = String(gameState.mini.correct);
        badEl.textContent = String(gameState.mini.wrong);
        miniHUDSet({ timeLeft: gameState.mini.timeLeft || 45, streak: 0, progress: gameState.mini.progress, total: gameState.mini.total });
        updateHUD();
        nextPiece();
    }

    document.getElementById('pf-inicio').onclick = () => choose('inicio');
    document.getElementById('pf-acum').onclick = () => choose('acum');

    nextPiece();

    miniCountdown(45, () => {
        if (gameState.mini.correct >= 14) {
            gameState.merma = Math.max(0, gameState.merma - 0.3);
            updateHUD();
            miniDone({ message: "⏰ Tiempo. Rendimiento aceptable. Pulsa Finalizar.", rewardCoins: 2, heal: 3, score: 25 });
        } else {
            miniFail({ message: "⏰ Tiempo. Necesitabas al menos 14 aciertos.", damage: 7, score: -10 });
        }
    });

    miniHUDSet({ timeLeft: 45, streak: 0, progress: 0, total });
}

/* =========================
   MINIJUEGO 5: ABC (memory match)
   ========================= */
function renderMiniABC(city) {
    miniSetStageLabel("ABC: Matching de Drivers (60s) — empareja actividad ↔ driver y decide precio");

    const q = document.getElementById('puzzle-questions');
    if (!q) return;

    const d = city.abcData;

    const pairs = [
        { key: 'setup', front: '🎯 Setup', back: '🔑 # de Setups' },
        { key: 'insp', front: '✅ Inspección', back: '🔑 # de Inspecciones' },
        { key: 'ship', front: '🚚 Despacho', back: '🔑 # de Despachos' }
    ];

    const cards = [];
    pairs.forEach(p => {
        cards.push({ id: `a-${p.key}`, pair: p.key, text: p.front });
        cards.push({ id: `d-${p.key}`, pair: p.key, text: p.back });
    });
    cards.sort(() => Math.random() - 0.5);

    gameState.mini.total = cards.length / 2;
    gameState.mini.progress = 0;
    gameState.mini.first = null;
    gameState.mini.matched = new Set();

    q.innerHTML = `
      <div class="bg-black/30 rounded-lg p-5 border border-gray-700">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
          <div>
            <div class="text-lg font-bold text-orange-200">🎴 Fase 1</div>
            <div class="text-sm text-gray-300">Empareja cada <strong>actividad</strong> con su <strong>driver</strong>.</div>
          </div>
          <div class="bg-gray-900/60 rounded-lg px-4 py-2 border border-gray-700 text-sm">
            <span class="text-gray-400">Matches:</span> <span id="abc-m" class="font-extrabold text-white">0</span>/${gameState.mini.total}
          </div>
        </div>

        <div id="abc-grid" class="grid grid-cols-2 md:grid-cols-3 gap-3"></div>

        <div id="abc-decision" class="hidden mt-6 bg-gray-900/40 rounded-lg p-4 border border-gray-700">
          <div class="text-lg font-bold text-orange-200 mb-2">💡 Fase 2</div>
          <div class="text-sm text-gray-300 mb-4">Según drivers, ¿qué producto consume más <strong>setups</strong> y debería revisar su precio?</div>
          <div class="grid grid-cols-2 gap-3">
            <button id="abc-A" class="bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 rounded-lg">Producto A</button>
            <button id="abc-B" class="bg-crimson-700 hover:bg-crimson-600 text-white font-bold py-3 rounded-lg">Producto B</button>
          </div>
          <div class="text-xs text-gray-400 mt-3">Dato: Setups A=${d.products[0].setups}, B=${d.products[1].setups}</div>
        </div>
      </div>
    `;

    const grid = document.getElementById('abc-grid');
    grid.innerHTML = cards.map(c => `
      <button class="flip-card bg-gray-900/40 border-2 border-gray-700 rounded-lg p-0 overflow-hidden"
              data-id="${c.id}" data-pair="${c.pair}" onclick="abcFlip('${c.id}')">
        <div class="flip-inner">
          <div class="flip-face p-4 min-h-[86px] flex items-center justify-center">
            <div class="text-2xl">❓</div>
          </div>
          <div class="flip-face flip-back p-4 min-h-[86px] flex items-center justify-center">
            <div class="text-sm font-bold text-white text-center">${c.text}</div>
          </div>
        </div>
      </button>
    `).join('');

    window.abcFlip = function(id) {
        if (gameState.mini.matched.has(id)) return;
        const el = document.querySelector(`[data-id="${id}"]`);
        if (!el) return;
        if (el.classList.contains('flipped')) return;

        el.classList.add('flipped');

        if (!gameState.mini.first) {
            gameState.mini.first = id;
            return;
        }
        const firstId = gameState.mini.first;
        gameState.mini.first = null;

        const a = document.querySelector(`[data-id="${firstId}"]`);
        const b = el;
        const match = a && b && a.dataset.pair === b.dataset.pair && a.dataset.id !== b.dataset.id;

        if (match) {
            gameState.mini.matched.add(firstId);
            gameState.mini.matched.add(id);
            gameState.mini.progress++;
            gameState.score += 10;
            showMessage("✅ Match", "success", 900);
            document.getElementById('abc-m').textContent = String(gameState.mini.progress);
            miniHUDSet({ timeLeft: gameState.mini.timeLeft || 60, streak: 0, progress: gameState.mini.progress, total: gameState.mini.total });

            if (gameState.mini.progress >= gameState.mini.total) {
                document.getElementById('abc-decision').classList.remove('hidden');
                showMessage("⚡ Fase 2 desbloqueada", "info", 1500);
            }
        } else {
            gameState.health = Math.max(0, gameState.health - 2);
            updateHUD();
            showMessage("❌ No coincide", "warning", 900);
            setTimeout(() => {
                if (a) a.classList.remove('flipped');
                b.classList.remove('flipped');
            }, 550);
        }
    };

    // Fase 2
    function finishABC(ok) {
        if (ok) {
            gameState.margen = Math.min(80, gameState.margen + 3);
            updateHUD();
            miniDone({ message: "📈 ¡ABC aplicado! Margen ↑. Pulsa Finalizar.", rewardCoins: 3, heal: 4, score: 55 });
        } else {
            miniFail({ message: "⚠️ Ajuste incorrecto: el producto B consume más setups.", damage: 6, score: -6 });
        }
    }
    document.getElementById('abc-A').onclick = () => finishABC(d.products[0].setups > d.products[1].setups);
    document.getElementById('abc-B').onclick = () => finishABC(d.products[1].setups > d.products[0].setups);

    miniCountdown(60, () => {
        if (gameState.mini.completed) return;
        if (gameState.mini.progress >= gameState.mini.total) {
            showMessage("⏰ Tiempo. Termina la Fase 2 rápido.", "warning", 2200);
        } else {
            miniFail({ message: "⏰ Tiempo. No completaste los matches.", damage: 8, score: -10 });
        }
    });

    miniHUDSet({ timeLeft: 60, streak: 0, progress: 0, total: gameState.mini.total });
}

/* =========================
   MINIJUEGO 6: Variance Hunter (clicker)
   ========================= */
function renderMiniVarianceHunter(city) {
    miniSetStageLabel("Estándar: Caza de Variaciones (25s) — haz clic solo en DESFAVORABLES (D)");

    const q = document.getElementById('puzzle-questions');
    if (!q) return;

    const base = [
        { key: 'PV', name: 'Precio MP', amount: city.puzzle?.[0]?.answer ?? 0 },
        { key: 'QV', name: 'Cantidad MP', amount: city.puzzle?.[1]?.answer ?? 0 },
        { key: 'RV', name: 'Tarifa MOD', amount: city.puzzle?.[2]?.answer ?? 0 },
        { key: 'EV', name: 'Eficiencia MOD', amount: city.puzzle?.[3]?.answer ?? 0 }
    ];

    gameState.mini.total = 14;
    gameState.mini.progress = 0;
    gameState.mini.correct = 0;
    gameState.mini.wrong = 0;

    q.innerHTML = `
      <div class="bg-black/30 rounded-lg p-5 border border-gray-700">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
          <div>
            <div class="text-lg font-bold text-orange-200">🎯 Objetivo</div>
            <div class="text-sm text-gray-300">Haz <strong>14</strong> clics correctos. Si clicas una Favorable (F) pierdes salud.</div>
          </div>
          <div class="bg-gray-900/60 rounded-lg px-4 py-2 border border-gray-700 text-sm">
            <span class="text-gray-400">OK:</span> <span id="vh-ok" class="font-extrabold text-white">0</span> ·
            <span class="text-gray-400">Fail:</span> <span id="vh-bad" class="font-extrabold text-white">0</span>
          </div>
        </div>

        <div id="vh-grid" class="grid grid-cols-2 md:grid-cols-3 gap-3"></div>
        <div class="text-xs text-gray-400 mt-3 text-center">Tip: Las desfavorables implican sobrecosto; son las que debes detectar.</div>
      </div>
    `;

    const grid = document.getElementById('vh-grid');
    const tiles = Array.from({ length: 6 }, (_, i) => ({ id: i, active: false, payload: null }));
    grid.innerHTML = tiles.map(t => `
      <button id="vh-${t.id}" class="bg-gray-900/40 border-2 border-gray-700 rounded-lg p-4 min-h-[90px] hover:scale-105 transition-transform">
        <div class="text-xs text-gray-400">Esperando...</div>
      </button>
    `).join('');

    function randomPayload() {
        const b = base[Math.floor(Math.random() * base.length)];
        const isBad = Math.random() < 0.7; // 70% desfavorable
        return { ...b, flag: isBad ? 'D' : 'F' };
    }

    function activateOne() {
        if (gameState.mini.completed) return;
        const id = Math.floor(Math.random() * tiles.length);
        const payload = randomPayload();
        const btn = document.getElementById(`vh-${id}`);
        if (!btn) return;
        tiles[id].active = true;
        tiles[id].payload = payload;

        btn.classList.add('pulse-tile');
        btn.innerHTML = `
          <div class="flex justify-between items-center mb-1">
            <div class="text-xs text-gray-300">${payload.name}</div>
            <div class="text-xs font-extrabold ${payload.flag==='D'?'text-red-300':'text-green-300'}">${payload.flag}</div>
          </div>
          <div class="text-lg font-extrabold text-white">$${formatNum(payload.amount)}</div>
          <div class="text-[11px] text-gray-400">Click si es D</div>
        `;

        // Expira rápido
        setTimeout(() => {
            if (!tiles[id].active) return;
            tiles[id].active = false;
            tiles[id].payload = null;
            btn.classList.remove('pulse-tile');
            btn.innerHTML = `<div class="text-xs text-gray-400">Esperando...</div>`;
        }, 900);
    }

    tiles.forEach(t => {
        const btn = document.getElementById(`vh-${t.id}`);
        btn.onclick = () => {
            if (!t.active || !t.payload || gameState.mini.completed) return;
            if (t.payload.flag === 'D') {
                gameState.mini.correct++;
                gameState.mini.progress++;
                gameState.score += 6;
                showMessage("✅ Detectada", "success", 650);
            } else {
                gameState.mini.wrong++;
                gameState.health = Math.max(0, gameState.health - 4);
                gameState.score -= 4;
                showMessage("❌ Era Favorable (trampa)", "error", 900);
                updateHUD();
            }
            document.getElementById('vh-ok').textContent = String(gameState.mini.correct);
            document.getElementById('vh-bad').textContent = String(gameState.mini.wrong);

            // limpiar tile
            t.active = false;
            t.payload = null;
            btn.classList.remove('pulse-tile');
            btn.innerHTML = `<div class="text-xs text-gray-400">Esperando...</div>`;

            miniHUDSet({ timeLeft: gameState.mini.timeLeft || 25, streak: 0, progress: gameState.mini.progress, total: gameState.mini.total });
            updateHUD();

            if (gameState.mini.progress >= gameState.mini.total) {
                // Reduce CU un poco si fue bueno
                if (gameState.mini.wrong <= 2) gameState.cu.actual = Math.max(0, gameState.cu.actual - 0.25);
                updateHUD();
                miniDone({ message: "📊 Variaciones controladas. CU ↓. Pulsa Finalizar.", rewardCoins: 3, heal: 5, score: 55 });
            }
        };
    });

    miniCountdown(25, () => {
        if (gameState.mini.progress >= gameState.mini.total) {
            miniDone({ message: "✅ ¡A tiempo! Pulsa Finalizar.", rewardCoins: 2, heal: 3, score: 20 });
        } else {
            miniFail({ message: `⏰ Tiempo. Lograste ${gameState.mini.progress}/${gameState.mini.total} detecciones.`, damage: 8, score: -12 });
        }
    });

    gameState.mini.tick = setInterval(activateOne, 420);
    miniHUDSet({ timeLeft: 25, streak: 0, progress: 0, total: gameState.mini.total });
}

/* =========================
   MINIJUEGO 7: TOC Scheduler (decisiones + constraints)
   ========================= */
function renderMiniTOC(city) {
    miniSetStageLabel("BOSS: Planificador TOC (90s) — arma el mix con 600 min y maximiza contribución");

    const q = document.getElementById('puzzle-questions');
    if (!q) return;

    const d = city.bottleneckData;
    const A = d.products.find(x => x.name === 'A');
    const B = d.products.find(x => x.name === 'B');

    gameState.mini.total = 1;
    gameState.mini.progress = 0;
    gameState.mini.A = 0;
    gameState.mini.B = 0;
    gameState.mini.urgent = false;

    q.innerHTML = `
      <div class="bg-black/30 rounded-lg p-5 border border-gray-700">
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-gray-900/40 rounded-lg p-4 border border-gray-700">
            <div class="text-lg font-bold text-orange-200 mb-2">⚠️ Restricción</div>
            <div class="text-sm text-gray-300 mb-3">Capacidad: <strong>${d.capacity}</strong> min/día · B tiene demanda máx. <strong>${B.demand}</strong> u</div>

            <div class="bg-black/20 rounded-lg p-3 border border-gray-700 mb-3">
              <div class="flex justify-between text-sm"><span class="text-gray-300">A:</span><span class="text-white font-bold">$${A.contribution}/u · ${A.timePerUnit} min/u</span></div>
              <div class="flex justify-between text-sm"><span class="text-gray-300">B:</span><span class="text-white font-bold">$${B.contribution}/u · ${B.timePerUnit} min/u</span></div>
            </div>

            <label class="flex items-center gap-2 text-sm text-gray-200">
              <input id="toc-urgent" type="checkbox" class="accent-crimson-600">
              Aceptar pedido urgente de B (+${d.urgentOrder.priceIncrease}% contribución, requiere ≥20u B)
            </label>
            <div class="text-xs text-gray-400 mt-2">Meta: maximiza contribución sin pasarte de minutos.</div>
          </div>

          <div class="bg-gray-900/40 rounded-lg p-4 border border-gray-700">
            <div class="text-lg font-bold text-orange-200 mb-2">🧠 Tu Mix</div>

            <div class="grid grid-cols-2 gap-3">
              <div class="bg-black/20 rounded-lg p-3 border border-gray-700">
                <div class="font-bold text-white mb-2">Producto A</div>
                <div class="flex items-center justify-between">
                  <button class="bg-gray-700 hover:bg-gray-600 text-white font-bold px-3 py-2 rounded" onclick="tocAdjust('A',-1)">−</button>
                  <div class="text-2xl font-extrabold text-white" id="toc-A">0</div>
                  <button class="bg-green-700 hover:bg-green-600 text-white font-bold px-3 py-2 rounded" onclick="tocAdjust('A',1)">+</button>
                </div>
              </div>

              <div class="bg-black/20 rounded-lg p-3 border border-gray-700">
                <div class="font-bold text-white mb-2">Producto B</div>
                <div class="flex items-center justify-between">
                  <button class="bg-gray-700 hover:bg-gray-600 text-white font-bold px-3 py-2 rounded" onclick="tocAdjust('B',-1)">−</button>
                  <div class="text-2xl font-extrabold text-white" id="toc-B">0</div>
                  <button class="bg-blue-700 hover:bg-blue-600 text-white font-bold px-3 py-2 rounded" onclick="tocAdjust('B',1)">+</button>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 mt-3">
              <div class="bg-black/20 rounded-lg p-3 border border-gray-700">
                <div class="text-xs text-gray-400">Minutos usados</div>
                <div class="text-xl font-extrabold text-white"><span id="toc-min">0</span> / ${d.capacity}</div>
              </div>
              <div class="bg-black/20 rounded-lg p-3 border border-gray-700">
                <div class="text-xs text-gray-400">Contribución</div>
                <div class="text-xl font-extrabold text-white">$ <span id="toc-contrib">0</span></div>
              </div>
            </div>

            <div class="text-xs text-gray-400 mt-3">Cuando estés listo, pulsa <strong>Finalizar Reto</strong>.</div>
          </div>
        </div>
      </div>
    `;

    window.tocAdjust = function(prod, delta) {
        const cap = d.capacity;

        if (prod === 'A') {
            gameState.mini.A = Math.max(0, gameState.mini.A + delta);
        } else {
            const nextB = Math.max(0, gameState.mini.B + delta);
            gameState.mini.B = Math.min(B.demand, nextB);
        }

        const urgent = document.getElementById('toc-urgent');
        gameState.mini.urgent = !!(urgent && urgent.checked);

        const mins = gameState.mini.A * A.timePerUnit + gameState.mini.B * B.timePerUnit;
        const bContr = gameState.mini.urgent ? (B.contribution * (1 + d.urgentOrder.priceIncrease / 100)) : B.contribution;
        const contrib = gameState.mini.A * A.contribution + gameState.mini.B * bContr;

        document.getElementById('toc-A').textContent = String(gameState.mini.A);
        document.getElementById('toc-B').textContent = String(gameState.mini.B);
        document.getElementById('toc-min').textContent = String(mins);
        document.getElementById('toc-contrib').textContent = formatNum(contrib);

        // feedback de capacidad
        const minEl = document.getElementById('toc-min');
        if (mins > cap) {
            minEl.classList.add('text-red-300');
            showMessage("⚠️ Te pasaste de la capacidad. Reduce unidades.", "warning", 1400);
        } else {
            minEl.classList.remove('text-red-300');
        }

        // guarda
        gameState.mini.usedMin = mins;
        gameState.mini.contrib = contrib;

        miniHUDSet({ timeLeft: gameState.mini.timeLeft || 90, streak: 0, progress: 0, total: 1 });
    };

    // Recalcular cuando cambia el checkbox
    const urgentEl = document.getElementById('toc-urgent');
    urgentEl.onchange = () => window.tocAdjust('A', 0);

    // Estado inicial
    window.tocAdjust('A', 0);

    // Timer
    miniCountdown(90, () => {
        showMessage("⏰ Tiempo. Pulsa Finalizar para evaluar tu mix.", "warning", 2500);
    });

    // Sobrescribimos condición de completado: se valida al finalizar
    gameState.mini.completed = true;
    gameState.mini.validateOnSubmit = true;
}

/* =========================
   Fallback simple (por si falta gameType)
   ========================= */
function renderMiniFallback(city) {
    miniSetStageLabel("Reto: Operación rápida (30s)");

    const q = document.getElementById('puzzle-questions');
    if (!q) return;

    q.innerHTML = `
      <div class="bg-black/30 rounded-lg p-5 border border-gray-700 text-center">
        <div class="text-2xl font-extrabold text-white mb-2">🎮 Reto no configurado</div>
        <div class="text-gray-300 mb-4">Esta ciudad aún no tiene minijuego único. Igual puedes tomar tu decisión final.</div>
        <div class="text-xs text-gray-500">Sugerencia: define un gameType y su minijuego.</div>
      </div>
    `;

    gameState.mini.completed = true;
    miniHUDSet({ timeLeft: 0, streak: 0, progress: 1, total: 1 });
}

// Hook extra: Validación especial TOC en submit
const __oldSubmitPuzzleRef = submitPuzzle;
submitPuzzle = function() {
    if (gameState.mini && gameState.mini.type === 'bottleneck' && gameState.mini.validateOnSubmit) {
        miniStopTimer();

        const city = cityData[gameState.currentCity];
        const d = city.bottleneckData;
        const A = d.products.find(x => x.name === 'A');
        const B = d.products.find(x => x.name === 'B');

        const used = gameState.mini.usedMin || 0;
        const cap = d.capacity;

        // Validaciones
        if (used > cap) {
            miniFail({ message: "❌ Mix inválido: excede la capacidad. Ajusta A/B.", damage: 8, score: -10 });
            return;
        }
        if (gameState.mini.urgent && (gameState.mini.B || 0) < 20) {
            miniFail({ message: "❌ Aceptaste pedido urgente, pero no cumples ≥20u de B.", damage: 8, score: -10 });
            return;
        }

        // Heurística: óptimo → prioriza contrib/min. A debería dominar.
        const contrib = gameState.mini.contrib || 0;
        const benchmark = (cap / A.timePerUnit) * A.contribution; // solo A
        const ratio = benchmark > 0 ? (contrib / benchmark) : 0;

        if (ratio >= 0.95) {
            gameState.margen = Math.min(90, gameState.margen + 6);
            addCoins(6);
            gameState.score += 80;
            showMessage("🏆 ¡Optimización TOC excelente! Margen ↑. Pasando a la decisión…", "success", 2200);
            // Marcar completado normal
            gameState.mini.completed = true;
        } else if (ratio >= 0.80) {
            addCoins(4);
            gameState.score += 45;
            showMessage("✅ Mix aceptable. Aún puedes mejorar la contribución.", "info", 2200);
            gameState.mini.completed = true;
        } else {
            gameState.health = Math.max(0, gameState.health - 10);
            gameState.score -= 10;
            showMessage("⚠️ Mix débil: revisa contribución por minuto.", "warning", 2500);
            gameState.mini.completed = true;
        }

        updateHUD();
        // Continuar a decisión final
        setTimeout(() => showDecisionPanel(), 600);
        return;
    }

    // De lo contrario, usar el comportamiento v3 estándar
    return __oldSubmitPuzzleRef();
};
