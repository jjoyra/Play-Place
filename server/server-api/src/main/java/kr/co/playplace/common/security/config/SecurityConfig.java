package kr.co.playplace.common.security.config;

import kr.co.playplace.common.security.filter.JwtAuthFilter;
import kr.co.playplace.common.security.filter.JwtExceptionFilter;
import kr.co.playplace.common.security.handler.MyAuthenticationFailureHandler;
import kr.co.playplace.common.security.handler.MyAuthenticationSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@Profile({"local", "prod"})
@RequiredArgsConstructor
public class SecurityConfig {
    private final MyAuthenticationSuccessHandler oAuth2LoginSuccessHandler;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final JwtAuthFilter jwtAuthFilter;
    private final JwtExceptionFilter jwtExceptionFilter;
    private final MyAuthenticationFailureHandler oAuth2LoginFailureHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .httpBasic().disable() // HTTP 기본 인증을 비활성화
                .cors().and() // CORS 활성화
                .csrf().disable() // CSRF 보호 기능 비활성화
                .headers().frameOptions().sameOrigin()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // 세션관리 정책을 STATELESS(세션이 있으면 쓰지도 않고, 없으면 만들지도 않는다)
                .and()
                .authorizeRequests() // 요청에 대한 인증 설정
//                .antMatchers("/**").permitAll()
                .antMatchers("/api/v1/auth/**").permitAll() // 토큰 발급을 위한 경로는 모두 허용
                .antMatchers(HttpMethod.POST, "/api/v1/users").permitAll() // POST 요청은 허용
                .antMatchers("/api/v1/users/**").authenticated() // /api/v1/users/** 경로로 들어오는 모든 요청은 인증이 필요함
                .antMatchers("/ws/**").permitAll()
                .anyRequest().authenticated() // 그 외의 모든 요청은 인증이 필요하다.
                .and()
                .oauth2Login() // OAuth2 로그인 설정시작
                .userInfoEndpoint().userService(customOAuth2UserService) // OAuth2 로그인시 사용자 정보를 가져오는 엔드포인트와 사용자 서비스를 설정
                .and()
                .failureHandler(oAuth2LoginFailureHandler) // OAuth2 로그인 실패시 처리할 핸들러를 지정해준다.
                .successHandler(oAuth2LoginSuccessHandler); // OAuth2 로그인 성공시 처리할 핸들러를 지정해준다.


        // JWT 인증 필터를 UsernamePasswordAuthenticationFilter 앞에 추가한다.
        return http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtExceptionFilter, JwtAuthFilter.class)
                .build();
    }

    @Bean
        // CORS 설정
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedMethod("*"); // 모든 HTTP 메서드 허용
        configuration.addAllowedHeader("*"); // 모든 헤더 허용
        configuration.setAllowCredentials(true); // 자격 증명 허용 설정

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 모든 경로에 대해 CORS 구성 적용
        return source;
    }

}