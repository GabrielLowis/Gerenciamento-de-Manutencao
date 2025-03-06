const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Opções de conexão com o MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bd_tasks'
});

const app = new express();  
app.listen(3000, () => {
    console.log('Servidor iniciado.');
})

app.use(cors());
app.use(express.json());

// Rotas
// ---------------------------------
app.get("/", (req, res) => {
    connection.query("SELECT COUNT(*) users FROM users", (err, results) => {
        if (err) {
            return res.status(500).send('MySQL Connection error');
        }
        res.send('MySQL Connection OK.');
    });
});


// ---------------------------------
app.get("/tasks", (req, res) => {
    connection.query("SELECT * from tasks", (err, results) => {
        if (err) {
            return res.status(500).send('MySQL Connection error'); // Encerra a execução aqui
        }
        res.json(results); // Só será executado se não houver erro
    });
});

// ---------------------------------
app.get("/usersColab/", (req, res) => {
    connection.query("SELECT username FROM users WHERE nivel = 2", (err, results) => {
        if (err) {
            return res.status(500).send('MySQL Connection error');
        }
        res.json(results);
    });
});


// -------------------------------------
app.get("/users/:username", (req, res) => {
    connection.query("SELECT id, passwrd, nivel FROM users WHERE username = ?", [req.params.username], (err, results) => {
        if (err) {
            return res.status(500).send('MySQL Connection error');
        }
        res.json(results);
    });
});


// -------------------------------------
app.get("/user/:id", (req, res) => {
    connection.query("SELECT id, username, passwrd FROM users WHERE id = ?", [req.params.id], (err, results) => {
        if (err) {
            res.send('MySQL Connection error');
        }

        res.json(results);
    })
});
// -------------------------------------

app.get("/user/:id/tasks/", (req, res) => {
    connection.query("SELECT * FROM tasks WHERE id_user = ?", [req.params.id], (err, results) => {
        if (err) {
            res.send('MySQL Connection error');
            console.log('erro');
        }

        res.json(results);
    })
});



// -------------------------------------
// app.get("/user/:nivel/tasks/", (req, res) => [
//     connection.query("SELECT * FROM tasks WHERE nivel = ?", [req.params.nivel], (err, result) => {
//         if (err) {
//             res.send('MySQL Connection error');
//             console.log('erro');
//         }

//         res.json(results);
//     })
// ])


// -------------------------------------

// Nova rota para pegar informações de uma tarefa de um usuário específico
app.get("/user/:id/tasks/:taskId", (req, res) => {
    // const userId = req.params.id;       // ID do usuário
    const taskId = req.params.taskId;   // ID da tarefa

    connection.query("SELECT * FROM tasks WHERE id = ?", [ taskId ], (err, results) => {
            if (err) {
                res.send('MySQL Connection error');
                console.log('erro');
            }

            // Se não encontrar nenhuma tarefa com os IDs fornecidos
            if (results.length === 0) {
                return res.status(404).json({ message: "Tarefa não encontrada para este usuário" });
            }

            // Retorna os resultados como JSON para o frontend
            res.json(results[0]); // Retorna a tarefa encontrada (apenas um resultado)
        }
    );
});

// -------------------------------------
app.post("/tasks/updateTask", (req, res) => {
    connection.query(
        "UPDATE tasks SET task_title = ?, task_status = ?, task_prior = ?, task_prazo = ?, task_sala = ?, task_respon = ?, task_text = ?, id_image = ?, updated_at = NOW() WHERE id = ?",
        [req.body.inputTitle, req.body.statusSpan, req.body.prioSpan, req.body.inputData, req.body.inputSala, req.body.inputRespon, req.body.descricao, req.body.idImage, req.body.idTask],
        (err, results) => {
            if (err) {
                console.error('MySQL Connection error:', err);
                return res.status(500).send('MySQL Connection error');
            }
            res.json('ok');
        }
    );
});


// -------------------------------------
app.post("/user/:id/tasks/createTask", (req, res) => {
    const { idUser, inputTitle, statusSpan, prioSpan, inputData, inputSala, inputRespon, descricao, imageId } = req.body;

    // Comando SQL para inserir uma nova linha na tabela 'tasks'
    connection.query("INSERT INTO tasks (id_user, task_title, task_status, task_prior, task_prazo, task_sala, task_respon, task_text, id_image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
        [idUser, inputTitle, statusSpan, prioSpan, inputData, inputSala, inputRespon, descricao, imageId],
        (err, results) => {
            if (err) {
                console.error('MySQL Connection error:', err);
                res.status(500).send('MySQL Connection error');
            } else {
                res.json({ message: 'Task criada com sucesso!', taskId: results.insertId });
            }
        }
    );
});

// -------------------------------------
app.delete("/user/:id/tasks/:taskId", (req, res) => {
    const { taskId } = req.params;

    connection.query("DELETE FROM tasks WHERE id = ?", [taskId], (err, results) => {
        if (err) {
            console.error("Erro ao deletar a tarefa:", err);
            res.status(500).send("Erro ao deletar a tarefa.");
        } else if (results.affectedRows === 0) { // O affectedRows é uma propriedade do objeto results retornado pelo método query do MySQL em Node.js. Ele indica o número de linhas que foram afetadas por uma consulta SQL no banco de dados. Essa propriedade é útil para verificar o impacto de comandos como UPDATE, DELETE, ou INSERT.
            res.status(404).send("Tarefa não encontrada.");
        } else {
            res.json({ message: "Tarefa deletada com sucesso!" });
        }
    });
});

// -------------------------------------
const multer = require('multer');
const { get } = require('express/lib/response');
const res = require('express/lib/response');
// const path = require('path');

const storage = multer.memoryStorage(); // Usa memória em vez de salvar no disco
const upload = multer({ storage });

// Rota para upload de imagem
app.post('/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Imagem não enviada." });
    }

    const { originalname, mimetype, buffer } = req.file;

    // Salva a imagem no banco de dados
    const query = `
        INSERT INTO images (filename, mimetype, image_data) VALUES (?, ?, ?)`;

    connection.query(query, [originalname, mimetype, buffer], (err, results) => {
        if (err) {
            console.error('Erro ao salvar imagem no banco:', err);
            return res.status(500).json({ message: 'Erro ao salvar imagem.' });
        }

        res.json({
            message: 'Imagem salva com sucesso!',
            imageId: results.insertId, // Retorna o ID da imagem salva
        });
    });
});

// -------------------------------------
// app.post("/image/updateImage/:imageId", (req, res) => {
//     connection.query("UPDATE images SET mimetype = ?, image_data = ?, filename = ?, WHERE id = ?", 
//         [req.body.mimetype, req.body.image_data, req.body.idImage], (err, results) => {
//         if (err) {
//             res.send('MySQL Connection error');
//             console.log('erro');
//         }
//     })
// })

// -------------------------------------
app.post("/createCall", (req, res) => {
    const { imageId, inputSala, descricao } = req.body;

    connection.query("INSERT INTO chamados (id_image, sala, text, created_at) VALUES (?, ?, ?, NOW())",
        [imageId, inputSala, descricao],
        (err, results) => {
            if (err) {
                console.error('MySQL Connection error:', err);
                res.status(500).send('MySQL Connection error');
            } else {
                res.json({ message: 'Chamado criado com sucesso!'});
            }
        }
    );
});

// -------------------------------------
app.get("/calls", (req, res) => {
        connection.query("SELECT * from chamados", (err, results) => {
            if (err) {
                res.send('MySQL Connection error');
            }
            res.json(results);    
        })
});

// -------------------------------------
app.get("/call/:idCall", (req, res) => {
    connection.query("SELECT * from chamados WHERE id = ?", [req.params.idCall], (err, results) => {
        if (err) {
           return res.send('MySQL Connection error');
        }
        res.json(results);
    })
});

// -------------------------------------
app.post("/call/updateCall", (req, res) => {
    // console.log(req.body.idUser);
    // console.log(req.body.idTask);
    // console.log(req.body.inputTitle);
    // res.send('finalizado');

    connection.query("UPDATE chamados SET sala = ?, text = ? WHERE id = ?", 
        [req.body.inputSala, req.body.descricao, req.body.idCall], (err, results) => {
        if (err) {
            res.send('MySQL Connection error');
            console.log('erro');
        }
    })
    
    res.json('ok');
});

// -------------------------------------
app.get('/getImage/:imageId', (req, res) => {
    const { imageId } = req.params;

    const query = 'SELECT mimetype, image_data FROM images WHERE id = ?';
    connection.query(query, [imageId], (err, result) => {
        if (err) {
            console.error("Erro ao buscar imagem:", err);
            return res.status(500).send("Erro no servidor");
        }

        if (result.length === 0) {
            return res.status(404).send("Imagem não encontrada");
        }

        const { mimetype, image_data } = result[0];
        res.setHeader('Content-Type', mimetype); // Define o tipo MIME da resposta
        res.send(image_data); // Envia os dados da imagem como resposta
    });
});

// -------------------------------------
app.delete('/getImage/delete/:imageId', (req, res) => {
    const { imageId } = req.params;

    connection.query("DELETE FROM images WHERE id = ?", [imageId], (err, results) => {
        if (err) {
            console.error("Erro ao deletar a imagem:", err);
            res.status(500).send("Erro ao deletar a imagem.");
        } else if (results.affectedRows === 0) { // O affectedRows é uma propriedade do objeto results retornado pelo método query do MySQL em Node.js. Ele indica o número de linhas que foram afetadas por uma consulta SQL no banco de dados. Essa propriedade é útil para verificar o impacto de comandos como UPDATE, DELETE, ou INSERT.
            res.status(404).send("Imagem não encontrada.");
        } else {
            res.json({ message: "Imagem deletada com sucesso!" });
        }
    });
});

// -------------------------------------
app.delete("/call/deleteCall/:idCall", (req, res) => {
    const { idCall } = req.params;

    connection.query("DELETE FROM chamados WHERE id = ?", [idCall], (err, results) => {
        if (err) {
            console.error("Erro ao deletar o chamado:", err);
            res.status(500).send("Erro ao deletar o chamado.");
        } else if (results.affectedRows === 0) { // O affectedRows é uma propriedade do objeto results retornado pelo método query do MySQL em Node.js. Ele indica o número de linhas que foram afetadas por uma consulta SQL no banco de dados. Essa propriedade é útil para verificar o impacto de comandos como UPDATE, DELETE, ou INSERT.
            res.status(404).send("Chamado não encontrada.");
        } else {
            res.json({ message: "Chamado deletada com sucesso!" });
        }
    });
});

// -------------------------------------
app.post("/coment/:taskId", (req, res) => {
    // const { valueComent, idTask } = req.body;
    
    connection.query("UPDATE tasks SET coment = ? WHERE id = ?",
        [req.body.valueComent, req.body.idTask], (err, results) => {
            if (err) {
                res.send('MySQL Connection error');
                console.log('erro');
                
            }
        })
});



// app.post("/call/updateCall", (req, res) => {
//     // console.log(req.body.idUser);
//     // console.log(req.body.idTask);
//     // console.log(req.body.inputTitle);
//     // res.send('finalizado');

//     connection.query("UPDATE chamados SET sala = ?, text = ? WHERE id = ?", 
//         [req.body.inputSala, req.body.descricao, req.body.idCall], (err, results) => {
//         if (err) {
//             res.send('MySQL Connection error');
//             console.log('erro');
//         }
//     })
    
//     res.json('ok');
// });


