import { supabase } from './supabase';

export interface SystemMetric {
  id: string;
  metricName: string;
  metricValue: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface SystemLog {
  id: string;
  logLevel: string;
  message: string;
  source?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface SystemAlert {
  id: string;
  alertType: string;
  severity: string;
  message: string;
  status: string;
  createdAt: Date;
  resolvedAt?: Date;
  metadata?: Record<string, any>;
}

export interface PerformanceMetric {
  id: string;
  endpoint?: string;
  responseTime?: number;
  statusCode?: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface UserMetric {
  id: string;
  userId: string;
  metricName: string;
  metricValue: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export const monitoringService = {
  // Métricas del Sistema
  async recordSystemMetric(
    metricName: string,
    metricValue: number,
    metadata?: Record<string, any>
  ): Promise<string> {
    const { data, error } = await supabase
      .rpc('record_system_metric', {
        p_metric_name: metricName,
        p_metric_value: metricValue,
        p_metadata: metadata
      });

    if (error) throw error;
    return data;
  },

  async getSystemMetrics(
    metricName?: string,
    startTime?: Date,
    endTime?: Date
  ): Promise<SystemMetric[]> {
    let query = supabase
      .from('system_metrics')
      .select('*')
      .order('timestamp', { ascending: false });

    if (metricName) {
      query = query.eq('metric_name', metricName);
    }

    if (startTime) {
      query = query.gte('timestamp', startTime.toISOString());
    }

    if (endTime) {
      query = query.lte('timestamp', endTime.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      metricName: item.metric_name,
      metricValue: item.metric_value,
      timestamp: new Date(item.timestamp),
      metadata: item.metadata
    }));
  },

  // Logs del Sistema
  async recordSystemLog(
    logLevel: string,
    message: string,
    source?: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    const { data, error } = await supabase
      .rpc('record_system_log', {
        p_log_level: logLevel,
        p_message: message,
        p_source: source,
        p_metadata: metadata
      });

    if (error) throw error;
    return data;
  },

  async getSystemLogs(
    logLevel?: string,
    startTime?: Date,
    endTime?: Date
  ): Promise<SystemLog[]> {
    let query = supabase
      .from('system_logs')
      .select('*')
      .order('timestamp', { ascending: false });

    if (logLevel) {
      query = query.eq('log_level', logLevel);
    }

    if (startTime) {
      query = query.gte('timestamp', startTime.toISOString());
    }

    if (endTime) {
      query = query.lte('timestamp', endTime.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      logLevel: item.log_level,
      message: item.message,
      source: item.source,
      timestamp: new Date(item.timestamp),
      metadata: item.metadata
    }));
  },

  // Alertas del Sistema
  async createSystemAlert(
    alertType: string,
    severity: string,
    message: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    const { data, error } = await supabase
      .rpc('create_system_alert', {
        p_alert_type: alertType,
        p_severity: severity,
        p_message: message,
        p_metadata: metadata
      });

    if (error) throw error;
    return data;
  },

  async getSystemAlerts(
    alertType?: string,
    status?: string,
    severity?: string
  ): Promise<SystemAlert[]> {
    let query = supabase
      .from('system_alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (alertType) {
      query = query.eq('alert_type', alertType);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (severity) {
      query = query.eq('severity', severity);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      alertType: item.alert_type,
      severity: item.severity,
      message: item.message,
      status: item.status,
      createdAt: new Date(item.created_at),
      resolvedAt: item.resolved_at ? new Date(item.resolved_at) : undefined,
      metadata: item.metadata
    }));
  },

  async resolveSystemAlert(alertId: string): Promise<void> {
    const { error } = await supabase
      .from('system_alerts')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString()
      })
      .eq('id', alertId);

    if (error) throw error;
  },

  // Métricas de Rendimiento
  async recordPerformanceMetric(
    endpoint?: string,
    responseTime?: number,
    statusCode?: number,
    metadata?: Record<string, any>
  ): Promise<string> {
    const { data, error } = await supabase
      .from('performance_metrics')
      .insert([{
        endpoint,
        response_time: responseTime,
        status_code: statusCode,
        metadata
      }])
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  async getPerformanceMetrics(
    endpoint?: string,
    startTime?: Date,
    endTime?: Date
  ): Promise<PerformanceMetric[]> {
    let query = supabase
      .from('performance_metrics')
      .select('*')
      .order('timestamp', { ascending: false });

    if (endpoint) {
      query = query.eq('endpoint', endpoint);
    }

    if (startTime) {
      query = query.gte('timestamp', startTime.toISOString());
    }

    if (endTime) {
      query = query.lte('timestamp', endTime.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      endpoint: item.endpoint,
      responseTime: item.response_time,
      statusCode: item.status_code,
      timestamp: new Date(item.timestamp),
      metadata: item.metadata
    }));
  },

  // Métricas de Usuario
  async recordUserMetric(
    userId: string,
    metricName: string,
    metricValue: number,
    metadata?: Record<string, any>
  ): Promise<string> {
    const { data, error } = await supabase
      .from('user_metrics')
      .insert([{
        user_id: userId,
        metric_name: metricName,
        metric_value: metricValue,
        metadata
      }])
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  async getUserMetrics(
    userId: string,
    metricName?: string,
    startTime?: Date,
    endTime?: Date
  ): Promise<UserMetric[]> {
    let query = supabase
      .from('user_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (metricName) {
      query = query.eq('metric_name', metricName);
    }

    if (startTime) {
      query = query.gte('timestamp', startTime.toISOString());
    }

    if (endTime) {
      query = query.lte('timestamp', endTime.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      metricName: item.metric_name,
      metricValue: item.metric_value,
      timestamp: new Date(item.timestamp),
      metadata: item.metadata
    }));
  }
}; 