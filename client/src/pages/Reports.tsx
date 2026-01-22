import { useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { trpc } from "@/lib/trpc";

export default function Reports() {
  const { data: projects } = trpc.project.getAll.useQuery();
  const { data: employees } = trpc.employee.getAll.useQuery();
  const { data: stats } = trpc.dashboard.getStats.useQuery();

  // Dados simulados para gráficos (em produção, viriam do banco)
  const productivityData = useMemo(() => [
    { name: "Seg", horas: 8, tarefas: 5 },
    { name: "Ter", horas: 7.5, tarefas: 6 },
    { name: "Qua", horas: 8.5, tarefas: 7 },
    { name: "Qui", horas: 7, tarefas: 4 },
    { name: "Sex", horas: 8, tarefas: 8 },
  ], []);

  const projectDistribution = useMemo(() => [
    { name: "Projeto A", value: 35, employees: 3 },
    { name: "Projeto B", value: 30, employees: 2 },
    { name: "Projeto C", value: 25, employees: 2 },
    { name: "Projeto D", value: 10, employees: 1 },
  ], []);

  const employeePerformance = useMemo(() => [
    { name: "João", tarefasCompletas: 12, tarefasPendentes: 3, tempoMédio: 6.5 },
    { name: "Maria", tarefasCompletas: 15, tarefasPendentes: 2, tempoMédio: 7.2 },
    { name: "Pedro", tarefasCompletas: 10, tarefasPendentes: 4, tempoMédio: 5.8 },
    { name: "Ana", tarefasCompletas: 14, tarefasPendentes: 1, tempoMédio: 7.5 },
  ], []);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Relatórios de Produtividade</h1>
          <p className="text-muted-foreground">Análise detalhada de desempenho e métricas</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Horas Totais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">38.5h</div>
              <p className="text-xs text-muted-foreground mt-1">Esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tarefas Concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">51</div>
              <p className="text-xs text-muted-foreground mt-1">+12% vs semana anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Conclusão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89%</div>
              <p className="text-xs text-muted-foreground mt-1">Excelente desempenho</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Médio/Tarefa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45min</div>
              <p className="text-xs text-muted-foreground mt-1">-8% vs semana anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Produtividade Semanal */}
          <Card>
            <CardHeader>
              <CardTitle>Produtividade Semanal</CardTitle>
              <CardDescription>Horas e tarefas por dia</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="horas" fill="#3b82f6" name="Horas" />
                  <Bar dataKey="tarefas" fill="#10b981" name="Tarefas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição de Projetos */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Projetos</CardTitle>
              <CardDescription>Alocação de recursos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tendência de Tarefas */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Desempenho dos Funcionários</CardTitle>
              <CardDescription>Tarefas completas vs pendentes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={employeePerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tarefasCompletas" fill="#10b981" name="Completas" />
                  <Bar dataKey="tarefasPendentes" fill="#ef4444" name="Pendentes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Detalhes */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo por Funcionário</CardTitle>
            <CardDescription>Métricas individuais de produtividade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Funcionário</th>
                    <th className="text-center py-3 px-4 font-semibold">Tarefas Completas</th>
                    <th className="text-center py-3 px-4 font-semibold">Pendentes</th>
                    <th className="text-center py-3 px-4 font-semibold">Taxa Conclusão</th>
                    <th className="text-center py-3 px-4 font-semibold">Tempo Médio</th>
                  </tr>
                </thead>
                <tbody>
                  {employeePerformance.map((emp, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{emp.name}</td>
                      <td className="text-center py-3 px-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          {emp.tarefasCompletas}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                          {emp.tarefasPendentes}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        {Math.round((emp.tarefasCompletas / (emp.tarefasCompletas + emp.tarefasPendentes)) * 100)}%
                      </td>
                      <td className="text-center py-3 px-4">{emp.tempoMédio}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
