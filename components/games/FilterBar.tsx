"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List, SortAsc } from "lucide-react";

interface FilterBarProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
  onSortChange: (sort: string) => void;
  onViewChange: (view: "grid" | "list") => void;
  selectedCategory: string;
  selectedSort: string;
  currentView: "grid" | "list";
  searchQuery: string;
}

export function FilterBar({
  onSearch,
  onCategoryFilter,
  onSortChange,
  onViewChange,
  selectedCategory,
  selectedSort,
  currentView,
  searchQuery,
}: FilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = [
    { value: "all", label: "All Games", count: 150 },
    { value: "rpg", label: "RPG", count: 45 },
    { value: "moba", label: "MOBA", count: 32 },
    { value: "battle-royale", label: "Battle Royale", count: 28 },
    { value: "strategy", label: "Strategy", count: 25 },
    { value: "action", label: "Action", count: 20 },
  ];

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "discount", label: "Best Discount" },
    { value: "newest", label: "Newest First" },
    { value: "rating", label: "Highest Rated" },
  ];

  const quickFilters = [
    { label: "Trending", value: "trending" },
    { label: "Fast Delivery", value: "fast" },
    { label: "Best Deals", value: "deals" },
    { label: "Premium", value: "premium" },
  ];

  return (
    <div className="bg-goblin-bg-card border border-goblin-border rounded-xl p-4 space-y-4">
      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-goblin-muted" />
          <Input
            placeholder="Search games... (e.g., PUBG, Free Fire, Genshin)"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 bg-goblin-bg border-goblin-border text-goblin-fg placeholder:text-goblin-muted focus:border-goblin-green"
          />
          {searchQuery && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 rounded-full bg-goblin-green flex items-center justify-center">
                <span className="text-xs font-bold text-goblin-bg">✓</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="border-goblin-border hover:bg-goblin-bg hover:border-goblin-green"
          >
            <Filter className="h-4 w-4" />
          </Button>
          
          <div className="flex border border-goblin-border rounded-lg overflow-hidden">
            <Button
              variant={currentView === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => onViewChange("grid")}
              className={`rounded-none ${
                currentView === "grid" 
                  ? "bg-goblin-green text-goblin-bg" 
                  : "text-goblin-muted hover:text-goblin-green hover:bg-goblin-bg"
              }`}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={currentView === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => onViewChange("list")}
              className={`rounded-none ${
                currentView === "list" 
                  ? "bg-goblin-green text-goblin-bg" 
                  : "text-goblin-muted hover:text-goblin-green hover:bg-goblin-bg"
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => (
          <Badge
            key={filter.value}
            variant="outline"
            className="cursor-pointer border-goblin-border text-goblin-muted hover:border-goblin-green hover:text-goblin-green transition-colors duration-200"
            onClick={() => onCategoryFilter(filter.value)}
          >
            {filter.label}
          </Badge>
        ))}
      </div>

      {/* Expanded Filters */}
      {isFilterOpen && (
        <div className="border-t border-goblin-border pt-4 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium text-goblin-fg mb-2 block">
                Category
              </label>
              <Select value={selectedCategory} onValueChange={onCategoryFilter}>
                <SelectTrigger className="bg-goblin-bg border-goblin-border text-goblin-fg">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-goblin-bg border-goblin-border">
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{category.label}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="text-sm font-medium text-goblin-fg mb-2 block">
                Sort By
              </label>
              <Select value={selectedSort} onValueChange={onSortChange}>
                <SelectTrigger className="bg-goblin-bg border-goblin-border text-goblin-fg">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-goblin-bg border-goblin-border">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <SortAsc className="h-4 w-4 mr-2" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  onSearch("");
                  onCategoryFilter("all");
                  onSortChange("popular");
                }}
                className="w-full border-goblin-border text-goblin-muted hover:border-goblin-green hover:text-goblin-green"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(selectedCategory !== "all" || searchQuery) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-goblin-muted">Active filters:</span>
          {selectedCategory !== "all" && (
            <Badge
              variant="secondary"
              className="bg-goblin-green/20 text-goblin-green border-goblin-green/30"
            >
              {categories.find(c => c.value === selectedCategory)?.label}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-auto p-0 hover:bg-transparent"
                onClick={() => onCategoryFilter("all")}
              >
                ×
              </Button>
            </Badge>
          )}
          {searchQuery && (
            <Badge
              variant="secondary"
              className="bg-goblin-purple/20 text-goblin-purple border-goblin-purple/30"
            >
              Search: "{searchQuery}"
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-auto p-0 hover:bg-transparent"
                onClick={() => onSearch("")}
              >
                ×
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}