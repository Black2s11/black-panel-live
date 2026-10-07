<?php
declare(strict_types=1);
@ini_set('display_errors','0'); @ini_set('html_errors','0'); error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8'); header('Cache-Control: no-store'); header('Access-Control-Allow-Origin: *'); header('Access-Control-Allow-Headers: Content-Type');
const TABLE_KEYS='keys_code';
function out(array $d,int $s=200):void{http_response_code($s);echo json_encode($d,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);exit;}
function p(string $n,$d=''){return isset($_POST[$n])?trim((string)$_POST[$n]):(isset($_GET[$n])?trim((string)$_GET[$n]):$d);}
function auth():void{$expected=(string)(getenv('BLACK_PANEL_API_KEY')?:($_ENV['BLACK_PANEL_API_KEY']??''));$given=(string)p('api_key','');if($expected===''||$given===''||!hash_equals($expected,$given))out(['status'=>false,'message'=>'Invalid API Key'],403);}
function bootdb(){ $root=dirname(__DIR__,2);$public=$root.'/public/';$pathsFile=$root.'/app/Config/Paths.php';if(!is_file($pathsFile)||!is_dir($public))out(['status'=>false,'message'=>'Server framework not found'],500);if(!defined('FCPATH'))define('FCPATH',$public);@chdir($public);require_once $pathsFile;$paths=new Config\Paths();$system=rtrim((string)$paths->systemDirectory,'\\/ ');if(is_file($system.'/bootstrap.php'))require_once $system.'/bootstrap.php';elseif(is_file($system.'/Boot.php')){require_once $system.'/Boot.php';if(class_exists('CodeIgniter\\Boot')&&method_exists('CodeIgniter\\Boot','bootConsole'))CodeIgniter\Boot::bootConsole($paths);}if(!function_exists('db_connect')&&is_file($system.'/Common.php'))require_once $system.'/Common.php';if(!function_exists('db_connect'))out(['status'=>false,'message'=>'Database service unavailable'],500);$db=db_connect();if(!$db||!$db->tableExists(TABLE_KEYS))out(['status'=>false,'message'=>'keys_code table not found'],500);return $db;}
function randkey():string{$c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';$s='';for($i=0;$i<10;$i++)$s.=$c[random_int(0,strlen($c)-1)];return $s;}
auth();
try{$db=bootdb();$fields=$db->getFieldNames(TABLE_KEYS);$has=fn($n)=>in_array($n,$fields,true);$a=strtolower((string)p('action','list'));
if($a==='ping')out(['status'=>true,'message'=>'BLACK keys API online']);
if($a==='list'){$rows=$db->table(TABLE_KEYS)->orderBy('id_keys','DESC')->get()->getResultArray();$items=[];foreach($rows as $r){$dev=array_values(array_filter(array_map('trim',explode(',',(string)($r['devices']??'')))));$r['used_devices']=count($dev);$r['devices']=$dev;$items[]=$r;}out(['status'=>true,'total'=>count($items),'keys'=>$items]);}
if($a==='generate'){$count=max(1,min(50,(int)p('loopcount',1)));$created=[];for($i=0;$i<$count;$i++){do{$key=randkey();}while($db->table(TABLE_KEYS)->where('user_key',$key)->countAllResults()>0);$cand=['game'=>p('game','PUBG'),'user_key'=>$key,'duration'=>max(1,(int)p('duration',1)),'max_devices'=>max(1,(int)p('max_devices',1)),'devices'=>null,'status'=>1,'registrator'=>'APP','admin_id'=>1,'expired_date'=>null,'admin_note'=>p('admin_note',''),'created_at'=>date('Y-m-d H:i:s'),'updated_at'=>date('Y-m-d H:i:s')];$data=[];foreach($cand as $k=>$v)if($has($k))$data[$k]=$v;$db->table(TABLE_KEYS)->insert($data);$created[]=$key;}out(['status'=>true,'keys'=>$created]);}
$id=(int)p('id_keys',0);if(in_array($a,['reset_devices','set_status','delete_key','update_key'],true)&&$id<1)out(['status'=>false,'message'=>'Missing id_keys'],400);
if($a==='reset_devices'){$db->table(TABLE_KEYS)->where('id_keys',$id)->update(['devices'=>null]);out(['status'=>true]);}
if($a==='set_status'){$db->table(TABLE_KEYS)->where('id_keys',$id)->update(['status'=>(int)p('status',1)]);out(['status'=>true]);}
if($a==='delete_key'){$db->table(TABLE_KEYS)->where('id_keys',$id)->delete();out(['status'=>true]);}
if($a==='update_key'){$cand=['user_key'=>p('user_key'),'duration'=>max(1,(int)p('duration',1)),'max_devices'=>max(1,(int)p('max_devices',1)),'admin_note'=>p('admin_note','')];$data=[];foreach($cand as $k=>$v)if($has($k))$data[$k]=$v;$db->table(TABLE_KEYS)->where('id_keys',$id)->update($data);out(['status'=>true]);}
out(['status'=>false,'message'=>'Unknown action'],400);
}catch(Throwable $e){out(['status'=>false,'message'=>'Server error'],500);}