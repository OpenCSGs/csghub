package httpbase

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

type GracefulServer struct {
	server *http.Server
}

type GraceServerOpt struct {
	Port int
}

func NewGracefulServer(opt GraceServerOpt, handler http.Handler) *GracefulServer {
	return &GracefulServer{
		server: &http.Server{
			Addr:    fmt.Sprintf(":%d", opt.Port),
			Handler: handler,
		},
	}
}

func (s *GracefulServer) Start() {
	q := make(chan os.Signal, 1)
	signal.Notify(q, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		if err := s.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			q <- syscall.SIGTERM

			slog.Error("failed to listen and serve", slog.Any("error", err))
		}
	}()

	<-q

	slog.Info("shutting down server gracefully, press Ctrl+C again to force")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := s.server.Shutdown(ctx); err != nil {
		slog.Error("failed to shutdown server", slog.Any("error", err))
	}

	slog.Info("server stopped")
}
