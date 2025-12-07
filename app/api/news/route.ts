import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export async function GET() {
  const parser = new Parser();

  const politics = await parser.parseURL('https://www3.nhk.or.jp/rss/news/cat0.xml');
  const economy = await parser.parseURL('https://www3.nhk.or.jp/rss/news/cat5.xml');
  const society = await parser.parseURL('https://www3.nhk.or.jp/rss/news/cat1.xml');

  const articles = [
    ...politics.items.map(item => ({ title: item.title, content: item.contentSnippet })),
    ...economy.items.map(item => ({ title: item.title, content: item.contentSnippet })),
    ...society.items.map(item => ({ title: item.title, content: item.contentSnippet })),
  ];

  return NextResponse.json(articles);
}
