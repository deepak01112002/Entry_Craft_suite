import { useState, useMemo } from 'react';
import { Plus, Search, Filter, Package, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { EntryCard } from '@/components/EntryCard';
import { useEntries } from '@/hooks/useEntries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { PROCESS_TYPES } from '@/types/entry';

const Dashboard = () => {
  const navigate = useNavigate();
  const { entries, isLoading } = useEntries();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState<Date | undefined>();
  const [filterProcess, setFilterProcess] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.productName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate = filterDate
        ? entry.date === format(filterDate, 'yyyy-MM-dd')
        : true;

      const matchesProcess = filterProcess && filterProcess !== 'all'
        ? entry.processType === filterProcess
        : true;

      return matchesSearch && matchesDate && matchesProcess;
    });
  }, [entries, searchTerm, filterDate, filterProcess]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterDate(undefined);
    setFilterProcess('');
  };

  const hasActiveFilters = searchTerm || filterDate || (filterProcess && filterProcess !== 'all');

  return (
    <div className="page-container">
      <Header />

      <main className="content-container pb-24">
        {/* Search & Filters */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search party or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3 p-4 bg-card rounded-lg border border-border animate-fade-in">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="justify-start">
                    {filterDate ? format(filterDate, 'dd MMM yyyy') : 'Select Date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filterDate}
                    onSelect={setFilterDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <Select value={filterProcess} onValueChange={setFilterProcess}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Process Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {PROCESS_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>

        {/* Entries List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredEntries.length > 0 ? (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">
              {hasActiveFilters ? 'No matching entries' : 'No entries yet'}
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              {hasActiveFilters
                ? 'Try adjusting your search or filters'
                : 'Create your first product processing entry'}
            </p>
            {!hasActiveFilters && (
              <Button onClick={() => navigate('/add-entry')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/add-entry')}
        className="floating-action-btn text-primary-foreground"
        aria-label="Add new entry"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Dashboard;
