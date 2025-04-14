const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB Atlas
const uri =
    "mongodb+srv://admin:admin@clustergdm.o3wll17.mongodb.net/?retryWrites=true&w=majority&appName=clusterGDM";

mongoose
    .connect(uri)
    .then(() => console.log("Conectado ao MongoDB Atlas"))
    .catch((err) => console.error("Erro ao conectar ao MongoDB Atlas", err));

// Definir Schemas
const UserSchema = new mongoose.Schema({
    username: String,
    passwrd: String,
    nivel: Number,
});

const TaskSchema = new mongoose.Schema({
    id_user: mongoose.Schema.Types.ObjectId,
    task_title: String,
    task_status: String,
    task_prior: String,
    task_prazo: Date,
    task_sala: String,
    task_respon: String,
    task_text: String,
    id_image: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    coment: String,
});

const ImageSchema = new mongoose.Schema({
    filename: String,
    mimetype: String,
    image_data: Buffer,
});

const ChamadoSchema = new mongoose.Schema({
    id_image: mongoose.Schema.Types.ObjectId,
    sala: String,
    text: String,
    created_at: { type: Date, default: Date.now },
});

// Criar modelos
const User = mongoose.model("User", UserSchema);
const Task = mongoose.model("Task", TaskSchema);
const Image = mongoose.model("Image", ImageSchema);
const Chamado = mongoose.model("Chamado", ChamadoSchema);

// Rotas
app.get("/", async (req, res) => {
    const count = await User.countDocuments();
    res.send("MongoDB Connection OK. Total Users: " + count);
});

app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// Buscar task apenas pelo id da task
app.get("/tasks/:idTask", async (req, res) => {
    const { idTask } = req.params;

    try {
        const task = await Task.findById(idTask);

        if (!task) {
            return res.status(404).json({ message: "Tarefa não encontrada." });
        }

        res.status(200).json(task);
    } catch (err) {
        console.error("Erro ao buscar tarefa:", err);
        res.status(500).json({ message: "Erro no servidor." });
    }
});

app.get("/usersColab", async (req, res) => {
    const users = await User.find({ nivel: 2 }, "username");
    res.json(users);
});

app.get("/users/:username", async (req, res) => {
    const user = await User.findOne(
        { username: req.params.username },
        "id passwrd nivel"
    );
    res.json(user);
});

app.get("/user/:id", async (req, res) => {
    const user = await User.findById(req.params.id, "id username passwrd");
    res.json(user);
});

app.get("/user/:id/tasks", async (req, res) => {
    const tasks = await Task.find({ id_user: req.params.id });
    res.json(tasks);
});

// Buscar task por idUser e idTask
app.get("/user/:idUser/tasks/:idTask", async (req, res) => {
    const { idUser, idTask } = req.params;

    try {
        const task = await Task.findOne({ _id: idTask, id_user: idUser });

        if (!task) {
            return res.status(404).json({ message: "Tarefa não encontrada." });
        }

        res.status(200).json(task);
    } catch (err) {
        console.error("Erro ao buscar tarefa:", err);
        res.status(500).json({ message: "Erro no servidor." });
    }
});

app.post("/tasks/updateTask", async (req, res) => {
    try {
        const {
            idTask,
            inputTitle,
            statusSpan,
            prioSpan,
            inputData,
            inputSala,
            inputRespon,
            descricao,
            idImage,
        } = req.body;

        const update = {
            task_title: inputTitle,
            task_status: statusSpan,
            task_prior: prioSpan,
            task_prazo: inputData,
            task_sala: inputSala,
            task_respon: inputRespon,
            task_text: descricao,
            id_image: idImage,
            updated_at: new Date(),
        };

        await Task.findByIdAndUpdate(idTask, update);
        res.status(200).json({ message: "Atualizado com sucesso" });
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        res.status(500).json({ error: "Erro ao atualizar tarefa" });
    }
});

app.post("/user/:id/tasks/createTask", async (req, res) => {
    // console.log("REQ.BODY >>>", req.body);
    const newTask = new Task(req.body);
    await newTask.save();
    res.json({ message: "Task criada com sucesso!", taskId: newTask._id });
});

app.delete("/user/:id/tasks/:taskId", async (req, res) => {
    await Task.findByIdAndDelete(req.params.taskId);
    res.json({ message: "Tarefa deletada com sucesso!" });
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload-image", upload.single("image"), async (req, res) => {
    if (!req.file)
        return res.status(400).json({ message: "Imagem não enviada." });

    const newImage = new Image({
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        image_data: req.file.buffer,
    });

    await newImage.save();

    res.json({ message: "Imagem salva com sucesso!", imageId: newImage._id });
});

app.get("/getImage/:imageId", async (req, res) => {
    const image = await Image.findById(req.params.imageId);
    if (!image) return res.status(404).send("Imagem não encontrada");
    res.setHeader("Content-Type", image.mimetype);
    res.send(image.image_data);
});

app.delete("/getImage/delete/:imageId", async (req, res) => {
    await Image.findByIdAndDelete(req.params.imageId);
    res.json({ message: "Imagem deletada com sucesso!" });
});

app.post("/createCall", async (req, res) => {
    const newCall = new Chamado(req.body);
    await newCall.save();
    res.json({ message: "Chamado criado com sucesso!" });
});


app.get("/calls", async (req, res) => {
    const calls = await Chamado.find();
    res.json(calls);
});

app.get("/call/:idCall", async (req, res) => {
    try {
        const call = await Chamado.findById(req.params.idCall);
        if (!call) return res.status(404).json({ message: "Chamado não encontrado" });
        res.json(call);
    } catch (error) {
        console.error("Erro ao buscar chamado:", error);
        res.status(500).json({ message: "Erro interno no servidor" });
    }
});

app.put("/call/updateCall/:id", async (req, res) => {
    const { id } = req.params;
    const { inputSala, descricao } = req.body;

    try {
        const updated = await Chamado.findByIdAndUpdate(
            id,
            { sala: inputSala, text: descricao },
            { new: true } // Retorna o objeto atualizado
        );

        if (!updated) {
            return res.status(404).json({ message: "Chamado não encontrado." });
        }

        res.status(200).json({ message: "Chamado atualizado com sucesso!", chamado: updated });
    } catch (err) {
        console.error("Erro ao atualizar chamado:", err);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});


app.delete("/call/deleteCall/:idCall", async (req, res) => {
    await Chamado.findByIdAndDelete(req.params.idCall);
    res.json({ message: "Chamado deletado com sucesso!" });
});

app.post("/coment/:taskId", async (req, res) => {
    await Task.findByIdAndUpdate(req.params.taskId, {
        coment: req.body.valueComent,
    });
    res.json("ok");
});

// Iniciar o servidor
// app.listen(port, () => {
//     console.log(`Servidor rodando na porta ${port}`);
// });

app.listen(port, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${port}`);
});
