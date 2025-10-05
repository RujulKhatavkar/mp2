import { getWithCache } from "./axios";

export type PokemonListItem = { name: string; url: string };
export type PokemonListResponse = { count: number; results: PokemonListItem[] };

export type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: { front_default: string | null; other?: any };
  types: { slot: number; type: { name: string } }[];
};

export async function fetchPokemonPage(offset = 0, limit = 50) {
  return getWithCache<PokemonListResponse>("/pokemon", { offset, limit });
}

export async function fetchPokemon(nameOrId: string | number) {
  return getWithCache<Pokemon>(`/pokemon/${nameOrId}`);
}
