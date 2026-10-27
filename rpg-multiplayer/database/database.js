
import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const Usuario = sequelize.define("Usuario", {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },

    senhaHash: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "usuarios"
});


const Personagem = sequelize.define("Personagem", {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },

    classe: {
        type: DataTypes.STRING,
        allowNull: false
    },

    descricao: {
        type: DataTypes.TEXT
    },

    forca: {
        type: DataTypes.INTEGER,
        defaultValue: 5
    },

    destreza: {
        type: DataTypes.INTEGER,
        defaultValue: 5
    },

    inteligencia: {
        type: DataTypes.INTEGER,
        defaultValue: 5
    },

    vida: {
        type: DataTypes.INTEGER,
        defaultValue: 100
    },

    vidaMaxima: {
        type: DataTypes.INTEGER,
        defaultValue: 100
    },

    avatarUrl: {
        type: DataTypes.STRING
    }
}, {
    tableName: "personagens"
});

const Sala = sequelize.define("Sala", {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },

    tema: {
        type: DataTypes.STRING,
        allowNull: false
    },

    historia: {
        type: DataTypes.TEXT
    },

    objetivo: {
        type: DataTypes.TEXT
    },

    codigoConvite: {
        type: DataTypes.STRING,
        unique: true
    },

    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "aguardando",
        validate: {
            isIn: [["aguardando", "em_andamento", "encerrada"]]
        }
    }
}, {
    tableName: "salas"
});


const PersonagemSala = sequelize.define("PersonagemSala", {
    personagemId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },

    salaId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    tableName: "personagens_salas",
    timestamps: false
});


const Mapa = sequelize.define("Mapa", {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },

    descricao: {
        type: DataTypes.TEXT
    },

    imagemUrl: {
        type: DataTypes.STRING
    },

    ordem: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    tableName: "mapas"
});


const Mensagem = sequelize.define("Mensagem", {
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [["acao", "narrativa", "sistema"]]
        }
    },

    conteudo: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: "mensagens"
});



// Um usuário pode criar vários personagens
Usuario.hasMany(Personagem, {
    foreignKey: {
        name: "usuarioId",
        allowNull: false
    },
    as: "personagens",
    onDelete: "CASCADE"
});

Personagem.belongsTo(Usuario, {
    foreignKey: "usuarioId",
    as: "usuario"
});


// Um usuário pode criar várias salas
Usuario.hasMany(Sala, {
    foreignKey: {
        name: "criadorId",
        allowNull: false
    },
    as: "salasCriadas"
});

Sala.belongsTo(Usuario, {
    foreignKey: "criadorId",
    as: "criador"
});


// Uma sala pode ter vários personagens
// Um personagem pode participar de várias salas
Personagem.belongsToMany(Sala, {
    through: PersonagemSala,
    foreignKey: "personagemId",
    otherKey: "salaId",
    as: "salas"
});

Sala.belongsToMany(Personagem, {
    through: PersonagemSala,
    foreignKey: "salaId",
    otherKey: "personagemId",
    as: "personagens"
});


// Uma sala pode ter vários mapas
Sala.hasMany(Mapa, {
    foreignKey: {
        name: "salaId",
        allowNull: false
    },
    as: "mapas",
    onDelete: "CASCADE"
});

Mapa.belongsTo(Sala, {
    foreignKey: "salaId",
    as: "sala"
});


// Uma sala pode ter várias mensagens
Sala.hasMany(Mensagem, {
    foreignKey: {
        name: "salaId",
        allowNull: false
    },
    as: "mensagens",
    onDelete: "CASCADE"
});

Mensagem.belongsTo(Sala, {
    foreignKey: "salaId",
    as: "sala"
});


// Um usuário pode enviar várias mensagens
Usuario.hasMany(Mensagem, {
    foreignKey: {
        name: "usuarioId",
        allowNull: true
    },
    as: "mensagens"
});

Mensagem.belongsTo(Usuario, {
    foreignKey: "usuarioId",
    as: "usuario"
});


// Um personagem pode estar associado a várias mensagens
Personagem.hasMany(Mensagem, {
    foreignKey: {
        name: "personagemId",
        allowNull: true
    },
    as: "mensagens"
});

Mensagem.belongsTo(Personagem, {
    foreignKey: "personagemId",
    as: "personagem"
});


// EXPORTAÇÃO DOS MODELOS
export {
    sequelize,
    Usuario,
    Personagem,
    Sala,
    PersonagemSala,
    Mapa,
    Mensagem
};
