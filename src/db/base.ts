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
      "stockages": {
        type: "text[]",
        title: "Région",
        create: "text[] NOT NULL",
        list : true                
      },
      "etats": {
        type: "text[]",
        title: "Région",
        create: "text[] NOT NULL",
        list : true                
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
            list : true
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
          
        }, 
        "constraints" : [
          "CONSTRAINT passeport_pkey PRIMARY KEY (id)"
        ]
  }, 
  "echantillons" : {
    save: true,
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
          list : false,
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
          create: "varchar(25) NOT NULL",
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
          title: "Pdentification",
          create: "varchar(16) NOT NULL",
          list: true,
          etiquette: "1902202617320002"
        },
        "parent": {
          type: "text",
          title: "Echantillon parent",
          create: "varchar(16) NULL",
          list: false,
          etiquette: "1902202617320001"
        },
        "dossier": {
          type: "text",
          title: "Numéro de dossier",
          create: "varchar(4) NOT NULL DEFAULT ''",
          list: false,
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
          create: "varchar(15) NOT NULL",
          list: false,
          excel: true,
          etiquette: "2.549023"
        },
        "longitude": {
          type: "text",
          title: "Point Y",
          create: "varchar(15) NOT NULL",
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
            list: false,
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
              create: "varchar(15) NOT NULL",
              list: true
            },
            "longitude": {
              type: "text",
              title: "Position Y",
              create: "varchar(15) NOT NULL",
              list: true
            },
        },
            
      "constraints" : ["CONSTRAINT sites_pkey PRIMARY KEY (id)"]
  },    
  "excels" : {
    save: false,
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
  }
}








