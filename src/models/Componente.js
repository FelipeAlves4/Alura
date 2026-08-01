const mongoose = require('mongoose');

const componenteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Por favor, adicione um nome'],
        trim: true,
        maxlength: [200, 'O nome não pode ter mais que 200 caracteres']
    },
    categoria: {
        type: String,
        required: [true, 'Por favor, adicione uma categoria'],
        enum: ['processador', 'placa-mae', 'placa-video', 'memoria-ram', 'armazenamento', 'fonte', 'gabinete', 'cooler', 'monitor', 'perifericos']
    },
    marca: {
        type: String,
        required: [true, 'Por favor, adicione uma marca'],
        trim: true
    },
    modelo: {
        type: String,
        required: [true, 'Por favor, adicione um modelo'],
        trim: true
    },
    descricao: {
        type: String,
        required: [true, 'Por favor, adicione uma descrição'],
        maxlength: [2000, 'A descrição não pode ter mais que 2000 caracteres']
    },
    preco: {
        type: Number,
        required: [true, 'Por favor, adicione um preço'],
        min: [0, 'O preço não pode ser negativo']
    },
    precoAnterior: {
        type: Number,
        min: [0, 'O preço anterior não pode ser negativo']
    },
    linkCompra: {
        type: String,
        trim: true
    },
    imagem: {
        type: String,
        required: [true, 'Por favor, adicione uma imagem']
    },
    videoAnalise: {
        url: String,
        thumbnail: String,
        titulo: String
    },
    especificacoes: {
        processador: {
            socket: String,
            frequencia: String,
            nucleos: Number,
            threads: Number
        },
        placaMae: {
            socket: String,
            chipset: String,
            formato: String,
            slotsRam: Number,
            slotsPCIe: Number
        },
        placaVideo: {
            memoria: String,
            tipoMemoria: String,
            frequencia: String,
            consumo: String
        },
        memoria: {
            capacidade: String,
            tipo: String,
            frequencia: String,
            latencia: String
        },
        armazenamento: {
            capacidade: String,
            tipo: String,
            velocidadeLeitura: String,
            velocidadeGravacao: String
        },
        fonte: {
            potencia: String,
            certificacao: String,
            modular: Boolean
        },
        monitor: {
            tamanho: String,
            resolucao: String,
            taxaAtualizacao: String,
            painel: String,
            tempoResposta: String
        }
    },
    desempenho: {
        nota: {
            type: Number,
            min: 0,
            max: 10,
            default: 0
        },
        custoBeneficio: {
            type: Number,
            min: 0,
            max: 10,
            default: 0
        },
        qualidade: {
            type: Number,
            min: 0,
            max: 10,
            default: 0
        }
    },
    tags: [String],
    destaque: {
        type: Boolean,
        default: false
    },
    disponivel: {
        type: Boolean,
        default: true
    },
    dataAtualizacao: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices para busca
componenteSchema.index({ nome: 'text', descricao: 'text', marca: 'text', modelo: 'text' });
componenteSchema.index({ categoria: 1 });
componenteSchema.index({ preco: 1 });
componenteSchema.index({ destaque: 1 });
componenteSchema.index({ 'desempenho.custoBeneficio': -1 });

module.exports = mongoose.model('Componente', componenteSchema);

