import { Idb, Icolumn } from "../types";

const index: Icolumn = {
                type: "index" ,
                title: "Index",
                create: "int2 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 32767 START 1 CACHE 1 NO CYCLE) NOT NULL",
                list : false
            } 
            
export const dataBase: Idb = {
  "configuration": {
    save: true,
    name: "configuration",
    singular: "configuration",
    create: true,
    import: false,
    "columns": {
      "id": index,
      "site": {
        type: "text",
        title: "Nom de l'unité",
        create: "varchar(25) NOT NULL",
        list : true                
      },
      "code": {
        type: "text",
        title: "Code Pays",
        create: "varchar(2) NOT NULL",
        list : true                
      },
      "debug": {
        type: "boolean",
        title: "Mode debug",
        create: "boolean NOT NULL default false",
        list : true                
      },
      "passeport": {
        type: "boolean",
        title: "Gestion Passeport",
        create: "boolean NOT NULL default true",
        list : true                
      },
      "pays": {
        type: "text",
        title: "Pays",
        create: "varchar(25) NOT NULL",
        list : true                
      },
      "region": {
        type: "text",
        title: "Région",
        create: "varchar(25) NOT NULL",
        list : true                
      },
      "latitude": {
        type: "text",
        title: "Point X",
        create: "varchar(15) NOT NULL",
        list: false
      },
      "longitude": {
        type: "text",
        title: "Point Y",
        create: "varchar(15) NOT NULL",
        list: false
      },        
      "identifiant": {
        type: "text",
        title: "Identifiant passeport",
        create: "varchar(10) NOT NULL",
        list : true                
      },
      "etats": {
        type: "text[]",
        title: "Etats",
        create: "text[] NOT NULL",
        list : true                
      },
      "types": {
        type: "text[]",
        title: "Types",
        create: "text[] NOT NULL",
        list : true                
      },
      "sizes": {
        type: "text[]",
        title: "Text sizes",
        create: "text[] NOT NULL",
        list : true                
      },
      "stockages": {
        type: "text[]",
        title: "Région",
        create: "text[] NOT NULL",
        list : true                
      },
      "print": {
        type: "json",
        title: "Paramètres Imprimante",
        create: "jsonb NULL",
        list: false               
      },
      "etiquette": {
        type: "json",
        title: "Paramètres étiquettes",
        create: "jsonb NULL",
        list: false               
      }
    },
    "constraints" : []
  },
  
  "passeports" : {
    save: true,
    name: "passeports",
    singular: "passeport",
    create: true,
    import: false,
    "columns": {
          "id": index,
          "site": {
            type: "text",
            title: "Site",
            create: "varchar(50) NOT NULL",
            list: true
          },              
          "annee": {
            type: "number" ,
            title: "Année de délivrance",
            create: "int2 NOT NULL",
            list : true
          },
          "tracabilite": {
            type: "text" ,
            title: "Code de tracabilité",
            create: "int2 NOT NULL",
            list : true
          },
          "code": {
            type: "text" ,
            title: "Code pays",
            create: "varchar(2) NOT NULL DEFAULT 'FR'",
            list : false
          },
          "identifiant": {
            type: "text" ,
            title: "Identifiant",
            create: "varchar(7) NOT NULL DEFAULT 'BR13551'",
            list : false
          },
          "origine": {
            type: "text" ,
            title: "Pays origine",
            create: "varchar(2) NOT NULL",
            list : false
          },
          "fichier": {
            type: "text" ,
            title: "Fichier joint",
            create: "int2 NULL",
            list : false
          },
          "echantillons": {
            type: "number",
            title: "N°",
            create: "",
            calculate: 'SELECT COUNT(*) FROM echantilllons WHERE passeport=id',
            list: true,
          },
          
        }, 
        "constraints" : [
          "CONSTRAINT passeport_pkey PRIMARY KEY (id)"
        ]
  },
  
  "campagnes" : {
    save: false,
    name: "campagnes",
    singular: "campagne",    
    create: false,
    import: false,
    "columns": {
      "id": {
          type: "text",
          title: "Identification",
          create: "",
          calculate: "src.id",
          list: false,
        },
      "type": {
          type: "text",
          title: "Type de prélèvement",
          create: "",
          calculate: "src.type",
          list : true,
        },
        "dossier": {
          type: "text",
          title: "N° dossier",
          create: "",
          calculate: "src.dossier",
          list: true
        },        
        "programme": {
          type: "text",
          title: "Nom du programme",
          create: "",
          calculate: "src.programme",
          list: true,
        },
        "responsable": {
          type: "text",
          title: "Résponsable",
          create: "",
          calculate: "src.responsable",
          list: true,
        },
        "creation": {
          type: "timestamp",
          title: "Date de création",
          create: "",
          calculate: "src.creation",
          list: false,
        },
        "prelevement": {
          type: "date",
          title: "Date de prélèvement",
          create: "",
          calculate: "CONCAT(SUBSTRING (src.prelevement::text FROM 9 FOR 2), '-', SUBSTRING (src.prelevement::text FROM 6 FOR 2), '-', SUBSTRING (src.prelevement::text FROM 0 FOR 5))",
          list: true,
        },
        "echantillons": {
          type: "number",
          title: "N°",
          create: "",
          calculate: "(SELECT COUNT(*) FROM echantillons WHERE COALESCE(parent, identification) LIKE src.id || '%')",
          searchType: "infos",
          list: true,
        },
    },
            
      "constraints" : ["CONSTRAINT echantillons_pkey UNIQUE NULLS NOT DISTINCT (type, identification)"]
  },
  
  "echantillons" : {
    save: true,
    name: "echantillons",
    singular: "echantillon",      
    create: true,
    import: true,
    "columns": {
      "id": {
          type: "index" ,
          title: "Index",
          create: "int8 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL",
          list : false
      } ,
      "type": {
          type: "text",
          title: "Type de prélèvement",
          create: "varchar(25) NOT NULL",
          list : true,
          etiquette: "Sol"
        },
        "programme": {
          type: "text",
          title: "Nom du programme",
          create: "varchar(25) NOT NULL",
          list: true,
          excel: true,
          etiquette: "Programme concerné"
        },
        "pedagogique": {
          type: "boolean",
          title: "Programme pédagogique",
          create: "boolean NOT NULL default false",
          list : false,
          excel: false,
          etiquette: "Programme pédagogique"
        },            
        "condition": {
          type: "text",
          title: "Condition de prélèvement",
          create: "varchar(50) NULL",
          list: false,
          excel: true,
          etiquette: "Etanol"
        },
        "site": {
          type: "text",
          title: "Site de prélèvement",
          create: "varchar(50) NOT NULL",
          list: true,
          excel: true,
          etiquette: "Nom du site",
        },
        "responsable": {
          type: "text",
          title: "Résponsable",
          create: "varchar(25) NOT NULL",
          list: true,
          excel: true,
          etiquette: "ADAM Mario"
        },
        "identification": {
          type: "text",
          title: "Identification",
          create: "varchar(16) NOT NULL",
          list: true,
          etiquette: "1902202617320002"
        },
        "parent": {
          type: "text",
          title: "Echantillon parent",
          create: "varchar(16) NULL",
          searchType: "hidden",
          list: true,
          etiquette: "1902202617320001"
        },
        "alicotage": {
          type: "boolean",
          searchType: "boolean",
          title: "Alicotage",
          create: "",
          list : true,
          calculate: "(parent IS NOT NULL)::BOOLEAN",
        },
        "dossier": {
          type: "text",
          title: "Numéro de dossier",
          create: "varchar(4) NOT NULL DEFAULT ''",
          list: true,
          excel: true,
          etiquette: "0029"
        },
        "libre": {
          type: "text",
          title: "Texte libre",
          create: "varchar(50) NULL",
          list: false,
          excel: true,
          etiquette: "Texte libre limité à 50 caractères"
        },
        "creation": {
          type: "timestamp",
          title: "Date de création",
          create: "timestamp without time zone",
          list: false,
          excel: false,
        },
        "prelevement": {
          type: "date",
          title: "Date de prélèvement",
          create: "date NOT NULL",
          list: false,
          excel: true,
        },
        "peremption": {
          type: "date",
          title: "Date de péremption",
          create: "date NOT NULL",
          list: false,
          excel: true,
        },
        "pays": {
          type: "text",
          title: "Pays",
          create: "varchar(25) NOT NULL",
          list: false,
          excel: true,
          etiquette: "France"
        },
        "region": {
          type: "text",
          title: "Région",
          create: "varchar(30) NOT NULL",
          list: false,
          excel: true,
          etiquette: "Bretagne"
        },
        "latitude": {
          type: "text",
          title: "Point X",
          create: "varchar(20) NOT NULL",
          list: false,
          excel: true,
          etiquette: "2.549023"
        },
        "longitude": {
          type: "text",
          title: "Point Y",
          create: "varchar(20) NOT NULL",
          list: false,
          excel: true,
          etiquette: "49.9967718"
        },
        // ATTENTION Not passeport id but passeport tracabilite
        "passeport": {
          type: "number",
          title: "Passeport",
          create: "int2 NULL", 
          list: false
        },
        "cultures": {
          type: "json",
          title: "Historique cultural",
          create: "jsonb NULL",
          list: false
        },
        "stockage": {
          type: "json",
          title: "Informations de stockage",
          create: "jsonb NULL",
          list: false
        },
        "etiquette": {
          type: "json",
          title: "Paramètres étiquettes",
          create: "jsonb NULL",
          list: false
        },
        "analyses": {
            type: "text[]",
            title: "Analyses",
            create: "text[] NULL",
            list: true,
            excel: true,
            etiquette: "Matière org, Physico-chimi ADNe 1"               
        },
        "etat": {
          type: "text",
          title: "Etat du prélèvement",
          create: "varchar(10) NOT NULL", 
          list: true,
          etiquette: "Créer"
        },
    },
    "constraints" : ["CONSTRAINT echantillons_pkey UNIQUE NULLS NOT DISTINCT (type, identification)"]
  },
  
  "rpg" : {
    save: true,
    name: "rpg",
    singular: "rpg",   
    create: true,
    import: false,
    "columns": {
      "code": {
        type: "text" ,
        title: "Code",
        create: "varchar(4) UNIQUE NOT NULL",
        list : false
      },
      "valeur": {
          type: "text",
          title: "Valeur",
          create: "varchar(150) NOT NULL",
          list: false
      },
    },              
    "constraints" : []
  },

  "sites" : {
    save: true,
    name: "sites",
    singular: "site",       
    create: true,
    import: false,
    "columns": {
      "id": index,
      "nom": {
        type: "text" ,
        title: "Nom du site",
        create: "varchar(50) NOT NULL",
        list : true
      },
        "pays": {
          type: "text",
          title: "Pays",
          create: "varchar(25) NOT NULL",
          list: true
        },
        "region": {
          type: "text",
          title: "Région",
          create: "varchar(30) NOT NULL",
          list: true
        },
        "latitude": {
          type: "text",
          title: "Position X",
          create: "varchar(20) NOT NULL",
          list: true
        },
        "longitude": {
          type: "text",
          title: "Position Y",
          create: "varchar(20) NOT NULL",
          list: true
        },
    },
    "constraints" : ["CONSTRAINT sites_pkey PRIMARY KEY (id)"]
  },
  
  "excels" : {
    save: false,
    name: "excels",
    singular: "excel",    
    create: true,
    import: false,
    "columns": {
          "id": index,
          "datas": {
            type: "json",
            title: "Datas",
            create: "jsonb NOT NULL",
            list : false
          },
        },
            
      "constraints" : []
  },  

  "selections" : {
    save: false,
    name: "selections",
    singular: "selection",      
    create: true,
    import: false,
    "columns": {
          "id": index,
          "ids": {
            type: "numbers[]",
            title: "List od ids",
            create: "integer[]",
            list : false
          },
        },
            
      "constraints" : []
  },  

  "fichiers" : {
    save: true,
    name: "fichiers",
    singular: "fichier",       
    create: true,
    import: false,
    "columns": {
          "id": index,
          "nom": {
            type: "text",
            title: "Nom du fichier",
            create: "character VARYING(1024)",
            list : false                
          },
          "fichier": {
            type: "byte",
            title: "Fichier",
            create: "BYTEA",
            list : false                
          }
        },
            
      "constraints" : []
  },

  "evenements" : {
    save: true,
    name: "evenements",
    singular: "evenement",     
    create: true,
    import: false,
    "columns": {
      "id": {
          type: "index" ,
          title: "Index",
          create: "int8 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL",
          list : false
        },
        "date": {
          type: "timestamp",
          title: "Date",
          create: "timestamp without time zone",
          list: true,
          excel: false,
        },
        "identification": {
          type: "text",
          title: "Identification",
          create: "varchar(16) NOT NULL",
          list: true,
          etiquette: "1902202617320002"
        },
        "personne": {
          type: "text",
          title: "Personne",
          create: "varchar(50) NOT NULL",
          list: true,
          excel: true,
          etiquette: "ADAM Mario"
        },
        "operation": {
          type: "text",
          title: "Opération",
          create: "varchar(255) NOT NULL",
          list: true,
        },
        "savestockage": {
          type: "json",
          title: "Stockage initial",
          create: "jsonb NULL",
          list: false
        },
        "saveetat": {
          type: "text",
          title: "Etat initialt",
          create: "varchar(10) NOT NULL", 
          list: true,
          etiquette: "Créer"
        },
    },
    "constraints" : []
  },    
}








