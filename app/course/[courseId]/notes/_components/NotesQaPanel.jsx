'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const RECENT_MESSAGE_COUNT = 4;

function NotesQaPanel({ courseTitle, chapterTitle, contentId, onOpenChange }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionPos, setSelectionPos] = useState(null);
  const selectionRangeRef = useRef(null);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  const currentContext = useMemo(() => {
    return `${courseTitle || 'This course'} - ${chapterTitle || 'Current chapter'}`;
  }, [courseTitle, chapterTitle]);

  useEffect(() => {
    const updateTooltipPosition = (range) => {
      if (!range) {
        return;
      }

      const rect = range.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) {
        setSelectedText('');
        setSelectionPos(null);
        return;
      }

      const top = Math.min(Math.max(rect.top - 56, 16), window.innerHeight - 120);
      const left = Math.min(Math.max(rect.left, 16), window.innerWidth - 240);
      setSelectionPos({ top, left });
    };

    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        selectionRangeRef.current = null;
        setSelectedText('');
        setSelectionPos(null);
        return;
      }

      const text = selection.toString().trim();
      if (!text || text.length > 500) {
        selectionRangeRef.current = null;
        setSelectedText('');
        setSelectionPos(null);
        return;
      }

      const container = document.getElementById(contentId);
      if (!container) {
        selectionRangeRef.current = null;
        setSelectedText('');
        setSelectionPos(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const commonAncestor = range.commonAncestorContainer;
      const anchorNode = selection.anchorNode || commonAncestor;
      const focusNode = selection.focusNode || commonAncestor;
      const isSelectionInsideContainer =
        container.contains(anchorNode) ||
        container.contains(focusNode) ||
        container.contains(commonAncestor);

      if (!isSelectionInsideContainer || range.collapsed) {
        selectionRangeRef.current = null;
        setSelectedText('');
        setSelectionPos(null);
        return;
      }

      selectionRangeRef.current = range.cloneRange();
      setSelectedText(text);
      updateTooltipPosition(range);
    };

    const handleScroll = () => {
      if (!selectionRangeRef.current || !selectedText) {
        return;
      }
      updateTooltipPosition(selectionRangeRef.current);
    };

    document.addEventListener('selectionchange', handleSelection);
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('selectionchange', handleSelection);
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [contentId, selectedText]);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const renderInlineMarkdown = (text) => {
    if (!text) {
      return null;
    }

    const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\((https?:\/\/[^)\s]+)\))/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={`txt-${key++}`}>{text.slice(lastIndex, match.index)}</span>);
      }

      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(<strong key={`strong-${key++}`}>{token.slice(2, -2)}</strong>);
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code key={`code-${key++}`} className="rounded bg-slate-100 px-1 py-0.5 text-[0.85em]">
            {token.slice(1, -1)}
          </code>
        );
      } else {
        const linkMatch = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
        if (linkMatch) {
          parts.push(
            <a
              key={`link-${key++}`}
              href={linkMatch[2]}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline underline-offset-2"
            >
              {linkMatch[1]}
            </a>
          );
        }
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={`txt-${key++}`}>{text.slice(lastIndex)}</span>);
    }

    return parts;
  };

  const renderMarkdownLite = (content) => {
    const lines = (content || '').split('\n');
    const elements = [];
    let listItems = [];
    let index = 0;

    const flushList = () => {
      if (listItems.length === 0) {
        return;
      }

      elements.push(
        <ul key={`ul-${index++}`} className="mb-3 list-disc space-y-1 pl-5">
          {listItems.map((item, itemIndex) => (
            <li key={`li-${itemIndex}`}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    };

    lines.forEach((line) => {
      const bulletMatch = line.match(/^\s*[-*]\s+(.+)/);
      if (bulletMatch) {
        listItems.push(bulletMatch[1]);
        return;
      }

      flushList();

      if (!line.trim()) {
        elements.push(<div key={`sp-${index++}`} className="h-2" />);
        return;
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${index++}`} className="mb-2 mt-1 text-base font-semibold text-slate-900">
            {renderInlineMarkdown(line.replace(/^###\s+/, ''))}
          </h3>
        );
        return;
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${index++}`} className="mb-2 mt-1 text-lg font-semibold text-slate-900">
            {renderInlineMarkdown(line.replace(/^##\s+/, ''))}
          </h2>
        );
        return;
      }

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${index++}`} className="mb-2 mt-1 text-xl font-semibold text-slate-900">
            {renderInlineMarkdown(line.replace(/^#\s+/, ''))}
          </h1>
        );
        return;
      }

      const labelMatch = line.match(/^\*\*(.+?)\*\*:\s*(.*)$/);
      if (labelMatch) {
        elements.push(
          <p key={`label-${index++}`} className="mb-2 leading-7 text-slate-800">
            <strong>{labelMatch[1]}:</strong> {renderInlineMarkdown(labelMatch[2])}
          </p>
        );
        return;
      }

      elements.push(
        <p key={`p-${index++}`} className="mb-2 leading-7 text-slate-800">
          {renderInlineMarkdown(line)}
        </p>
      );
    });

    flushList();
    return elements;
  };

  const sendRequest = async (action, inputQuestion) => {
    const text = inputQuestion?.trim() || '';
    if ((action === 'custom' || action === 'check' || action === 'explain_selection') && !text) {
      toast.error('Please provide text first.');
      return;
    }

    const userMessage =
      action === 'explain_selection'
        ? `Explain this selected text: ${text}`
        : action === 'explain'
          ? 'Explain this chapter simply.'
          : action === 'videos'
            ? 'Suggest YouTube videos for this chapter.'
            : action === 'check'
              ? `Check my understanding: ${text}`
              : text;

    addMessage({ role: 'user', content: userMessage });
    setLoading(true);

    try {
      const response = await axios.post('/api/qa', {
        action,
        question: text,
        courseTitle,
        chapterTitle,
      });

      addMessage({ role: 'assistant', content: response.data.response || 'No answer returned.' });

      if (action === 'custom' || action === 'check') {
        setQuestion('');
      }
    } catch (error) {
      console.error('Q&A request failed:', error);
      toast.error('Unable to fetch an answer right now.');
    } finally {
      setLoading(false);
    }
  };

  const explainSelectedText = () => {
    if (!selectedText) {
      return;
    }

    setOpen(true);
    sendRequest('explain_selection', selectedText);
    setSelectedText('');
    setSelectionPos(null);
    window.getSelection()?.removeAllRanges();
  };

  const olderMessages =
    messages.length > RECENT_MESSAGE_COUNT ? messages.slice(0, -RECENT_MESSAGE_COUNT) : [];
  const recentMessages =
    messages.length > RECENT_MESSAGE_COUNT ? messages.slice(-RECENT_MESSAGE_COUNT) : messages;

  const renderMessage = (message, index) => (
    <div
      key={index}
      className={`mb-3 rounded-2xl px-4 py-3 ${message.role === 'assistant' ? 'border border-slate-200 bg-white' : 'ml-4 bg-blue-600 text-white'}`}
    >
      <div
        className={`mb-2 text-[11px] uppercase tracking-[0.2em] ${message.role === 'assistant' ? 'text-slate-400' : 'text-blue-100'}`}
      >
        {message.role === 'assistant' ? 'AI Tutor' : 'You'}
      </div>
      <div className={`text-sm ${message.role === 'assistant' ? 'text-slate-800' : 'text-white'}`}>
        {message.role === 'assistant' ? renderMarkdownLite(message.content) : message.content}
      </div>
    </div>
  );

  return (
    <>
      {selectedText && selectionPos && (
        <div
          className="fixed z-50 max-w-xs rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-lg"
          style={{
            top: selectionPos.top,
            left: selectionPos.left,
            minWidth: 220,
            maxWidth: 'calc(100vw - 32px)',
          }}
        >
          <p className="text-xs text-slate-500 mb-2">Text selected</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={explainSelectedText}>
              Explain selection
            </Button>
          </div>
        </div>
      )}

      <div
        className={`fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 ${open ? 'hidden' : ''}`}
      >
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="rounded-full bg-blue-600 px-4 py-3 text-white shadow-2xl shadow-blue-600/20 hover:bg-blue-700"
        >
          Open AI Tutor
        </Button>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-hidden bg-slate-50 shadow-2xl md:w-[460px] md:border-l md:border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">AI Tutor</h2>
                <p className="text-sm text-slate-600">Chapter context</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>

            <div className="flex h-full flex-col gap-4 overflow-hidden px-5 py-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendRequest('explain')}
                  disabled={loading}
                >
                  Explain Simply
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendRequest('videos')}
                  disabled={loading}
                >
                  Suggest Videos
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                {messages.length === 0 ? (
                  <div className="text-sm text-slate-500">
                    Ask a question or select text from the notes to get started.
                  </div>
                ) : (
                  <>
                    {olderMessages.length > 0 && (
                      <details className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                        <summary className="cursor-pointer text-xs font-medium uppercase tracking-[0.16em] text-slate-600">
                          Older chats ({olderMessages.length})
                        </summary>
                        <div className="mt-3">
                          {olderMessages.map((message, index) =>
                            renderMessage(message, `old-${index}`)
                          )}
                        </div>
                      </details>
                    )}

                    {recentMessages.map((message, index) => renderMessage(message, `new-${index}`))}

                    {loading && (
                      <div className="mb-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        <div className="mb-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                          AI Tutor
                        </div>
                        <div className="text-sm text-slate-500">Thinking...</div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <Textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Ask a question about this chapter..."
                  rows={3}
                />
                <div className="mt-3 flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => sendRequest('custom', question)}
                    disabled={loading || !question.trim()}
                  >
                    Send Question
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendRequest('check', question)}
                    disabled={loading || !question.trim()}
                  >
                    Check Understanding
                  </Button>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2">
                <div>
                  <p className="font-semibold text-slate-900">Context</p>
                  <p className="mt-1">{currentContext}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default NotesQaPanel;
