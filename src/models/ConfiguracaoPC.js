const mongoose = require('mongoose');

const configuracaoPCSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Por favor, adicione um nome'],
        trim: true,
        maxlength: [200, 'O nome não pode ter mais que 200 caracteres']
    },
    descricao: {
        type: String,
        required: [true, 'Por favor, adicione uma descrição'],
        maxlength: [2000, 'A descrição não pode ter mais que 2000 caracteres']
    },
    orcamento: {
        type: Number,
        required: [true, 'Por favor, adicione um orçamento'],
        min: [0, 'O orçamento não pode ser negativo']
    },
    precoTotal: {
        type: Number,
        required: [true, 'Por favor, adicione o preço total'],
        min: [0, 'O preço total não pode ser negativo']
    },
    componentes: {
        processador: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Componente'
        },
        placaMae: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Componente'
        },
        placaVideo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Componente'
        },
        memoria: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Componente'
        },
        armazenamento: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Componente'
        },
        fonte: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Componente'
        },
        gabinete: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Componente'
        },
        cooler: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Componente'
        }
    },
    desempenho: {
        notaGeral: {
            type: Number,
            min: 0,
            max: 10,
            default: 0
        },
        jogos1080p: {
            type: String,
            enum: ['baixo', 'medio', 'alto', 'ultra']
        },
        jogos1440p: {
            type: String,
            enum: ['baixo', 'medio', 'alto', 'ultra']
        },
        jogos4k: {
            type: String,
            enum: ['baixo', 'medio', 'alto', 'ultra']
        },
        produtividade: {
            type: String,
            enum: ['baixo', 'medio', 'alto', 'muito-alto']
        }
    },
    tags: [String],
    destaque: {
        type: Boolean,
        default: false
    },
    imagem: {
        type: String
    },
    videoAnalise: {
        url: String,
        thumbnail: String,
        titulo: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices
configuracaoPCSchema.index({ orcamento: 1 });
configuracaoPCSchema.index({ precoTotal: 1 });
configuracaoPCSchema.index({ destaque: 1 });
configuracaoPCSchema.index({ 'desempenho.notaGeral': -1 });

module.exports = mongoose.model('ConfiguracaoPC', configuracaoPCSchema);

