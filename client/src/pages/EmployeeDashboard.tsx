import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, LogIn, LogOut, Play, Pause, RotateCcw, Coffee, Timer } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EmployeeDashboard() {
  const [showProjectSelectModal, setShowProjectSelectModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<"work" | "rest">("work");
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(25 * 60);
  const [newTaskDescription, setNewTaskDescription] = useState("");

  // Queries
  const { data: employee } = trpc.employee.getMe.useQuery();
  const { data: projects } = trpc.project.getAll.useQuery();
  const { data: stats } = trpc.dashboard.getEmployeeStats.useQuery();
  const { data: tasks } = trpc.task.getByProjectId.useQuery(
    { projectId: employee?.currentProjectId || 0 },
    { enabled: !!employee?.currentProjectId }
  );

  // Mutations
  const updateStatus = trpc.employee.updateStatus.useMutation();
  const createTask = trpc.task.create.useMutation();
  const updateSettings = trpc.employee.updateSettings.useMutation();
  const createNote = trpc.note.create.useMutation();

  // Pomodoro Timer
  useEffect(() => {
    let interval: any = null;
    if (pomodoroActive && pomodoroTimeLeft > 0) {
      interval = setInterval(() => {
        setPomodoroTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroTimeLeft === 0 && pomodoroActive) {
      const nextMode = pomodoroMode === "work" ? "rest" : "work";
      const nextTime = nextMode === "work" ? (employee?.pomodoroWorkTime || 25) * 60 : (employee?.pomodoroRestTime || 5) * 60;
      
      toast({
        title: pomodoroMode === "work" ? "Hora de descansar!" : "Hora de focar!",
        description: `O ciclo de ${pomodoroMode === "work" ? "foco" : "descanso"} terminou.`,
      });
      
      setPomodoroMode(nextMode);
      setPomodoroTimeLeft(nextTime);
      setPomodoroActive(false);
    }

    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroTimeLeft, pomodoroMode, employee?.pomodoroWorkTime, employee?.pomodoroRestTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartFocus = () => {
    if (employee?.currentProjectId) {
      setPomodoroMode("work");
      setPomodoroTimeLeft((employee?.pomodoroWorkTime || 25) * 60);
      setPomodoroActive(true);
    } else {
      setShowProjectSelectModal(true);
    }
  };

  const handleConfirmStartFocus = async () => {
    if (!selectedProjectId) return;
    
    await updateStatus.mutateAsync({
      status: "project",
      projectId: parseInt(selectedProjectId),
    });

    await createNote.mutateAsync({
      title: `Entrada no Projeto`,
      content: `Você entrou no projeto`,
      type: "project",
      projectId: parseInt(selectedProjectId),
    });

    setPomodoroMode("work");
    setPomodoroTimeLeft((employee?.pomodoroWorkTime || 25) * 60);
    setPomodoroActive(true);
    setShowProjectSelectModal(false);
    setSelectedProjectId("");

    toast({
      title: "Foco Iniciado",
      description: "Seu momento de foco começou!",
    });
  };

  const handleStartRest = async () => {
    if (employee?.currentProjectId) {
      setShowExitModal(true);
    } else {
      await updateStatus.mutateAsync({ status: "rest" });
      setPomodoroMode("rest");
      setPomodoroTimeLeft((employee?.pomodoroRestTime || 5) * 60);
      setPomodoroActive(true);
    }
  };

  const handleConfirmLeaveProject = async (withTask: boolean) => {
    if (employee?.currentProjectId) {
      if (withTask && newTaskDescription.trim()) {
        await createTask.mutateAsync({
          projectId: employee.currentProjectId,
          description: newTaskDescription,
        });
      }

      await createNote.mutateAsync({
        title: `Saída do Projeto`,
        content: `Você saiu do projeto`,
        type: "project",
        projectId: employee.currentProjectId,
      });
    }

    await updateStatus.mutateAsync({ status: "rest" });
    setPomodoroMode("rest");
    setPomodoroTimeLeft((employee?.pomodoroRestTime || 5) * 60);
    setPomodoroActive(true);
    setShowExitModal(false);
    setNewTaskDescription("");

    toast({
      title: "Descanso Iniciado",
      description: "Aproveite seu tempo de pausa!",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Meu Painel</h1>
          <p className="text-muted-foreground">Acompanhe seus projetos e produtividade</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Projeto Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {stats?.currentProject?.name || "Nenhum"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tarefas Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingTasks || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tarefas Concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.completedTasks || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Pomodoro */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Pomodoro
            </CardTitle>
            <CardDescription>Gerencie seus intervalos e pausas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
                pomodoroMode === "work" ? "bg-primary/20" : "bg-rest/20"
              }`}>
                <Timer className={`w-12 h-12 ${pomodoroMode === "work" ? "text-primary" : "text-rest"}`} />
              </div>
              
              <div className="mb-6">
                <h2 className="text-4xl font-mono font-bold">{formatTime(pomodoroTimeLeft)}</h2>
                <p className={`text-sm font-medium uppercase tracking-widest mt-2 ${
                  pomodoroMode === "work" ? "text-primary" : "text-rest"
                }`}>
                  {pomodoroMode === "work" ? "Foco Total" : "Descanso"}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 mb-8">
                <Button
                  size="lg"
                  onClick={() => setPomodoroActive(!pomodoroActive)}
                  className={`w-32 gap-2 ${
                    pomodoroActive ? "bg-muted hover:bg-muted/80 text-foreground" : "bg-primary text-primary-foreground"
                  }`}
                >
                  {pomodoroActive ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Iniciar
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setPomodoroActive(false);
                    setPomodoroTimeLeft(pomodoroMode === "work" ? (employee?.pomodoroWorkTime || 25) * 60 : (employee?.pomodoroRestTime || 5) * 60);
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className={`p-4 rounded-lg ${pomodoroMode === "work" ? "bg-primary/10 border border-primary/20" : "bg-muted/50"}`}>
                  <p className="text-2xl font-bold text-primary">{employee?.pomodoroWorkTime || 25}</p>
                  <p className="text-xs text-muted-foreground">Minutos de Foco</p>
                </div>
                <div className={`p-4 rounded-lg ${pomodoroMode === "rest" ? "bg-rest/10 border border-rest/20" : "bg-muted/50"}`}>
                  <p className="text-2xl font-bold text-rest">{employee?.pomodoroRestTime || 5}</p>
                  <p className="text-xs text-muted-foreground">Minutos de Pausa</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleStartFocus} className="flex-1 gap-2">
                <LogIn className="w-4 h-4" />
                Iniciar Foco
              </Button>
              <Button onClick={handleStartRest} variant="destructive" className="flex-1 gap-2">
                <Coffee className="w-4 h-4" />
                Descanso
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tarefas */}
        {employee?.currentProjectId && (
          <Card>
            <CardHeader>
              <CardTitle>Minhas Tarefas</CardTitle>
              <CardDescription>Tarefas do projeto atual</CardDescription>
            </CardHeader>
            <CardContent>
              {tasks && tasks.length > 0 ? (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div key={task.id} className="p-3 border rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium">{task.description}</p>
                        <p className="text-xs text-muted-foreground capitalize">{task.status}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Marcar como Concluída
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma tarefa no momento</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Project Select Modal */}
      <Dialog open={showProjectSelectModal} onOpenChange={setShowProjectSelectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecionar Projeto para Foco</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Escolha o projeto em que você vai focar
            </p>
            <Select onValueChange={setSelectedProjectId} value={selectedProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um projeto..." />
              </SelectTrigger>
              <SelectContent>
                {projects?.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowProjectSelectModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmStartFocus} disabled={!selectedProjectId}>
              Iniciar Foco
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exit Project Modal */}
      <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sair do Projeto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Deseja adicionar uma tarefa antes de sair?
            </p>
            <Input
              placeholder="Descrição da tarefa (opcional)"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => handleConfirmLeaveProject(false)}>
              Sair sem tarefa
            </Button>
            <Button onClick={() => handleConfirmLeaveProject(true)}>
              Adicionar e Sair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
