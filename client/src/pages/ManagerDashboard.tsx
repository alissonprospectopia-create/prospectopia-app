import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Copy, Check, Trash2, Edit2 } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ManagerDashboard() {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  
  const [projectForm, setProjectForm] = useState({
    name: "",
    type: "",
    scope: "",
    objectives: "",
    deliverables: "",
    contract: "",
  });

  // Queries
  const { data: stats } = trpc.dashboard.getStats.useQuery();
  const { data: projects } = trpc.project.getAll.useQuery();
  const { data: employees } = trpc.employee.getAll.useQuery();

  // Mutations
  const createProject = trpc.project.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Projeto criado com sucesso",
      });
      setProjectForm({
        name: "",
        type: "",
        scope: "",
        objectives: "",
        deliverables: "",
        contract: "",
      });
      setShowProjectModal(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar projeto",
        variant: "destructive",
      });
    },
  });

  const generateInvite = trpc.invite.generate.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Link gerado",
        description: "Link de convite criado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao gerar link",
        variant: "destructive",
      });
    },
  });

  const handleCreateProject = async () => {
    if (!projectForm.name || !projectForm.type) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    await createProject.mutateAsync(projectForm);
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(`${window.location.origin}${link}`);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2000);
    toast({
      title: "Copiado",
      description: "Link copiado para a área de transferência",
    });
  };

  const handleGenerateInvite = async () => {
    await generateInvite.mutateAsync();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Painel de Gestor</h1>
          <p className="text-muted-foreground">Gerencie projetos, funcionários e métricas</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Projetos Totais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProjects || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Projetos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeProjects || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Funcionários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalEmployees || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ativos Agora</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeEmployees || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Projetos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Projetos</CardTitle>
              <CardDescription>Crie e gerencie seus projetos</CardDescription>
            </div>
            <Button onClick={() => setShowProjectModal(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Projeto
            </Button>
          </CardHeader>
          <CardContent>
            {projects && projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.type}</p>
                        {project.scope && (
                          <p className="text-sm mt-2">{project.scope}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum projeto criado ainda</p>
            )}
          </CardContent>
        </Card>

        {/* Funcionários */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Funcionários</CardTitle>
              <CardDescription>Gerencie sua equipe</CardDescription>
            </div>
            <Button onClick={handleGenerateInvite} className="gap-2">
              <Plus className="w-4 h-4" />
              Gerar Link de Convite
            </Button>
          </CardHeader>
          <CardContent>
            {employees && employees.length > 0 ? (
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="p-4 border rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {employee.photo && (
                        <img src={employee.photo} alt={employee.name} className="w-10 h-10 rounded-full" />
                      )}
                      <div>
                        <h3 className="font-semibold">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{employee.status}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum funcionário adicionado ainda</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Project Modal */}
      <Dialog open={showProjectModal} onOpenChange={setShowProjectModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Projeto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Projeto *</Label>
              <Input
                id="name"
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                placeholder="Ex: Website Redesign"
              />
            </div>
            <div>
              <Label htmlFor="type">Tipo *</Label>
              <Input
                id="type"
                value={projectForm.type}
                onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
                placeholder="Ex: Web, Mobile, Design"
              />
            </div>
            <div>
              <Label htmlFor="scope">Escopo</Label>
              <Textarea
                id="scope"
                value={projectForm.scope}
                onChange={(e) => setProjectForm({ ...projectForm, scope: e.target.value })}
                placeholder="Descrição do escopo do projeto"
              />
            </div>
            <div>
              <Label htmlFor="objectives">Objetivos</Label>
              <Textarea
                id="objectives"
                value={projectForm.objectives}
                onChange={(e) => setProjectForm({ ...projectForm, objectives: e.target.value })}
                placeholder="Objetivos principais"
              />
            </div>
            <div>
              <Label htmlFor="deliverables">Entregáveis</Label>
              <Textarea
                id="deliverables"
                value={projectForm.deliverables}
                onChange={(e) => setProjectForm({ ...projectForm, deliverables: e.target.value })}
                placeholder="O que será entregue"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowProjectModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateProject} disabled={createProject.isPending}>
              Criar Projeto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
