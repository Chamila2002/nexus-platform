import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, User } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { usePosts } from '../contexts/PostContext';
import { Post, User as UserType } from '../types';
import { formatDate } from '../utils/formatters';

interface SearchResult {
  type: 'post' | 'user';
  data: Post | UserType;
}

interface SearchBarProps {
  onSearchResults?: (results: SearchResult[]) => void;
  placeholder?: string;
  showResults?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearchResults,
  placeholder = 'Search Nexus...',
  showResults = true,
}) => {
  const { getAllUsers } = useUser();
  const { posts } = usePosts();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allUsers = getAllUsers();

  useEffect(() => {
    const saved = localStorage.getItem('nexus_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    const userResults = allUsers.filter(
      (user) =>
        user.displayName.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        (user.bio && user.bio.toLowerCase().includes(searchTerm))
    );

    userResults.forEach((user) => results.push({ type: 'user', data: user }));

    const postResults = posts.filter((post) =>
      post.content.toLowerCase().includes(searchTerm)
    );

    postResults.forEach((post) => results.push({ type: 'post', data: post }));

    const limitedResults = results.slice(0, 10);
    setSearchResults(limitedResults);

    if (onSearchResults) {
      onSearchResults(limitedResults);
    }
  }, [query, allUsers, posts, onSearchResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      const newRecentSearches = [
        searchTerm,
        ...recentSearches.filter((s) => s !== searchTerm),
      ].slice(0, 5);

      setRecentSearches(newRecentSearches);
      localStorage.setItem(
        'nexus_recent_searches',
        JSON.stringify(newRecentSearches)
      );

      setQuery(searchTerm);
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('nexus_recent_searches');
  };

  const getUserById = (userId: string) => {
    return allUsers.find((user) => user.id === userId);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch(query);
          }}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-full leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors duration-300"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        )}
      </div>

      {isOpen && showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50 transition-colors duration-300">
          {query.trim().length === 0 ? (
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  Trending
                </h3>
                <div className="space-y-1">
                  {['#ReactJS', '#WebDev', '#TypeScript'].map((trend, i) => (
                    <button
                      key={i}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {trend}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  {result.type === 'user' ? (
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          (result.data as UserType).avatar ||
                          `https://ui-avatars.com/api/?name=${
                            (result.data as UserType).displayName
                          }&background=6366f1&color=fff&size=40`
                        }
                        alt={(result.data as UserType).displayName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {(result.data as UserType).displayName}
                          </p>
                          {(result.data as UserType).verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          @{(result.data as UserType).username}
                        </p>
                        {(result.data as UserType).bio && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">
                            {(result.data as UserType).bio}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <img
                          src={
                            getUserById((result.data as Post).userId)?.avatar ||
                            `https://ui-avatars.com/api/?name=${
                              getUserById((result.data as Post).userId)
                                ?.displayName
                            }&background=6366f1&color=fff&size=32`
                          }
                          alt={
                            getUserById((result.data as Post).userId)
                              ?.displayName
                          }
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex items-center space-x-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {
                              getUserById((result.data as Post).userId)
                                ?.displayName
                            }
                          </p>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            @
                            {
                              getUserById((result.data as Post).userId)
                                ?.username
                            }
                          </span>
                          <span className="text-gray-400">·</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate((result.data as Post).timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 ml-10">
                        {(result.data as Post).content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-sm">
                No results found for &quot;{query}&quot;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
