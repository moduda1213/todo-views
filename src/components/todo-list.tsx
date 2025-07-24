import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Plus, Trash2, MoreVertical, Calendar as CalendarIcon, Tag, Filter, CheckCircle2, Circle, GripVertical } from 'lucide-react';

// 할 일 항목 타입 정의
interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags: string[];
}

const priorityMap = {
  low: { label: '낮음', color: 'bg-green-500' },
  medium: { label: '중간', color: 'bg-yellow-500' },
  high: { label: '높음', color: 'bg-red-500' },
};

const TodoList = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: "주간 회의록 작성", completed: false, priority: 'high', tags: ['업무'], dueDate: new Date(new Date().setDate(new Date().getDate() + 3)) },
    { id: 2, text: "디자인 시안 검토 및 피드백", completed: true, priority: 'medium', tags: ['디자인', '업무'] },
    { id: 3, text: "API 명세서 업데이트", completed: false, priority: 'medium', tags: ['개발'] },
    { id: 4, text: "점심 약속 (박팀장님)", completed: true, priority: 'low', tags: ['개인'] },
    { id: 5, text: "운동하기 (필라테스)", completed: false, priority: 'low', tags: ['건강'], dueDate: new Date(new Date().setDate(new Date().getDate() - 1)) },
  ]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      const newTodoItem: TodoItem = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        priority: 'medium',
        tags: ['미분류']
      };
      setTodos([newTodoItem, ...todos]);
      setNewTodo("");
    }
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-2xl h-fit">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-primary" />
            My Todo List
          </CardTitle>
          <CardDescription>
            총 {totalCount}개의 할 일 중 {completedCount}개를 완료했습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 할 일 추가 */}
          <div className="flex w-full items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="새로운 할 일을 추가하세요..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                className="pl-10"
              />
              <Circle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button onClick={handleAddTodo} size="icon" className="flex-shrink-0">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          
          <Separator className="my-4" />

          {/* 필터 및 정렬 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button variant={filter === 'all' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('all')}>전체</Button>
              <Button variant={filter === 'active' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('active')}>진행중</Button>
              <Button variant={filter === 'completed' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('completed')}>완료됨</Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  정렬 및 필터
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>우선순위 높은 순</DropdownMenuItem>
                <DropdownMenuItem>마감일 순</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>태그별 필터</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 할 일 목록 */}
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-center p-3 rounded-lg transition-all border ${
                  todo.completed ? 'bg-muted/50 border-transparent' : 'bg-background hover:bg-muted/20'
                }`}
              >
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab mr-2 flex-shrink-0" />
                <Checkbox
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onCheckedChange={() => handleToggleTodo(todo.id)}
                  className="mr-4"
                />
                <div className="flex-1" onClick={() => handleToggleTodo(todo.id)}>
                  <p className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {todo.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${priorityMap[todo.priority].color}`} />
                      <span>{priorityMap[todo.priority].label}</span>
                    </div>
                    <Separator orientation="vertical" className="h-3" />
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {todo.tags.map(tag => <Badge key={tag} variant="outline" className="px-1.5 py-0.5">{tag}</Badge>)}
                    </div>
                    {todo.dueDate && (
                      <>
                        <Separator orientation="vertical" className="h-3" />
                        <div className={`flex items-center gap-1 ${
                          !todo.completed && todo.dueDate < new Date() ? 'text-destructive' : ''
                        }`}>
                          <CalendarIcon className="w-3 h-3" />
                          <span>{todo.dueDate.toLocaleDateString('ko-KR')}</span>  {/*** toLocaleDateString -> data-fns  */}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex-shrink-0 ml-2">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      마감일 설정
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteTodo(todo.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      삭제하기
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground mt-4">
          <p>드래그하여 순서를 변경하거나, 항목을 클릭하여 완료 처리할 수 있습니다.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TodoList;
