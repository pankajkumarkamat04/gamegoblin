"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Zap } from "lucide-react";

interface GameCardProps {
  id: string;
  title: string;
  publisher: string;
  image: string;
  discount?: number;
  originalPrice: number;
  currentPrice: number;
  rating: number;
  deliveryTime: string;
  isPopular?: boolean;
  isTrending?: boolean;
  className?: string;
}

export function GameCard({
  id,
  title,
  publisher,
  image,
  discount,
  originalPrice,
  currentPrice,
  rating,
  deliveryTime,
  isPopular = false,
  isTrending = false,
  className = "",
}: GameCardProps) {
  return (
    <Card className={`group hover:shadow-lg hover:shadow-goblin-green/20 transition-all duration-300 hover:-translate-y-1 bg-goblin-bg-card border-goblin-border overflow-hidden ${className}`}>
      <div className="relative">
        <div className="aspect-[16/9] relative overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              asChild
              className="goblin-button opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            >
              <Link href={`/games/${id}`}>
                Quick Top-up
              </Link>
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount && discount > 0 && (
            <Badge className="bg-goblin-red text-white font-bold">
              -{discount}% OFF
            </Badge>
          )}
          {isPopular && (
            <Badge className="bg-goblin-yellow text-goblin-bg font-bold">
              Popular
            </Badge>
          )}
          {isTrending && (
            <Badge className="bg-gradient-to-r from-goblin-green to-goblin-purple text-white font-bold">
              Trending
            </Badge>
          )}
        </div>

        {/* Goblin Peek */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-6 h-6 rounded-full bg-goblin-green flex items-center justify-center">
            <span className="text-xs font-bold text-goblin-bg">G</span>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Game Info */}
          <div>
            <h3 className="font-display font-semibold text-goblin-fg group-hover:text-goblin-green transition-colors duration-200 line-clamp-1">
              {title}
            </h3>
            <p className="text-sm text-goblin-muted">{publisher}</p>
          </div>

          {/* Rating and Delivery */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-goblin-yellow text-goblin-yellow" />
              <span className="text-goblin-muted">{rating}</span>
            </div>
            <div className="flex items-center space-x-1 text-goblin-green">
              <Clock className="h-4 w-4" />
              <span>{deliveryTime}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-goblin-green">
                ₹{currentPrice}
              </span>
              {discount && discount > 0 && (
                <span className="text-sm text-goblin-muted line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>
            
            <Button
              asChild
              className="w-full goblin-button group-hover:goblin-glow transition-all duration-300"
            >
              <Link href={`/games/${id}`}>
                <Zap className="h-4 w-4 mr-2" />
                Top-up Now
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}